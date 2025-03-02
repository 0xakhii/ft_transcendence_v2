import json
import redis.asyncio as aioredis
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import asyncio
import logging
import os
import time
import random
import math

logger = logging.getLogger(__name__)

class MatchmakingConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redis = None
        self.redis_host = os.environ.get('REDIS_HOST', 'redis')
        self.redis_port = int(os.environ.get('REDIS_PORT', 6379))
        self.user_id = None
        self.channel_layer = get_channel_layer()

    async def connect(self):
        await self.accept()
        self.user_id = self.scope['user'].username if self.scope['user'].is_authenticated else f"anon_{id(self)}"
        max_retries = 5
        retry_delay = 2
        for attempt in range(max_retries):
            try:
                self.redis = await aioredis.from_url(f"redis://{self.redis_host}:{self.redis_port}")
                logger.info("Successfully connected to Redis")
                break
            except Exception as e:
                logger.error(f"Redis connection attempt {attempt + 1}/{max_retries} failed: {str(e)}")
                if attempt == max_retries - 1:
                    await self.send(text_data=json.dumps({
                        "type": "error",
                        "message": "Failed to connect to matchmaking service"
                    }))
                    await self.close()
                    return
                await asyncio.sleep(retry_delay)
        await self.channel_layer.group_add("matchmaking", self.channel_name)
        await self.send(text_data=json.dumps({
            "type": "connected",
            "user_id": self.user_id
        }))
        logger.info(f"Player {self.user_id} connected - Channel: {self.channel_name}")

    async def disconnect(self, close_code):
        if self.channel_layer and self.channel_name:
            await self.channel_layer.group_discard("matchmaking", self.channel_name)
        if self.redis:
            await self.redis.close()
        logger.info(f"Player {self.user_id} disconnected with code: {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"Received message from {self.user_id}: {data}")
            if data['action'] == 'join_queue':
                await self.join_queue(data)
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON from {self.user_id}: {text_data}")
        except Exception as e:
            logger.error(f"Error in receive for {self.user_id}: {str(e)}")

    async def join_queue(self, event):
        try:
            queue_contents = await self.get_queue_contents()
            if self.user_id in queue_contents:
                logger.info(f"User {self.user_id} already in queue")
                return

            await self.add_to_queue(self.user_id)
            await self.send(text_data=json.dumps({
                "type": "joined_queue",
                "user_id": self.user_id
            }))

            queue_size = await self.get_queue_size()
            logger.info(f"Current queue state - Size: {queue_size}, User: {self.user_id}")

            if queue_size >= 2:
                player1_id = await self.get_first_in_queue()
                player2_id = await self.get_first_in_queue()
                if player1_id and player2_id:
                    game_group_name = f"game_{player1_id}_{player2_id}_{int(asyncio.get_event_loop().time())}"
                    logger.info(f"Match created: {player1_id} vs {player2_id}")
                    
                    match_data = {
                        "type": "match_found",
                        "player1_id": player1_id,
                        "player2_id": player2_id,
                        "game_group_name": game_group_name
                    }
                    
                    await self.channel_layer.group_send("matchmaking", {
                        "type": "match_found",
                        "data": match_data
                    })
            else:
                await self.send(text_data=json.dumps({
                    "type": "waiting",
                    "queue_size": queue_size
                }))
        except Exception as e:
            logger.error(f"Error in join_queue: {str(e)}")

    async def get_queue_contents(self):
        try:
            contents = await self.redis.lrange("matchmaking_queue", 0, -1)
            return [item.decode('utf-8') for item in contents] if contents else []
        except Exception as e:
            logger.error(f"Error getting queue contents: {str(e)}")
            return []

    async def get_queue_size(self):
        try:
            size = await self.redis.llen("matchmaking_queue")
            return size or 0
        except Exception as e:
            logger.error(f"Error getting queue size: {str(e)}")
            return 0

    async def add_to_queue(self, user_id):
        try:
            await self.redis.rpush("matchmaking_queue", user_id)
            logger.info(f"Added {user_id} to queue")
        except Exception as e:
            logger.error(f"Error adding to queue: {str(e)}")

    async def get_first_in_queue(self):
        try:
            user_id = await self.redis.lpop("matchmaking_queue")
            return user_id.decode('utf-8') if user_id else None
        except Exception as e:
            logger.error(f"Error getting first in queue: {str(e)}")
            return None

    async def remove_user_from_queue(self, user_id):
        try:
            await self.redis.lrem("matchmaking_queue", 1, user_id)
            logger.info(f"Removed {user_id} from queue")
        except Exception as e:
            logger.error(f"Error removing from queue: {str(e)}")

    async def match_found(self, event):
        data = event["data"]
        logger.info(f"Sending match_found to {self.user_id}: {data}")
        await self.send(text_data=json.dumps(data))

class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game_group_name = None
        self.user_id = None
        self.channel_layer = get_channel_layer()
        self.game_state = {
            "ball": {"x": 0, "y": 0, "z": 0, "vx": 0, "vy": 0, "vz": 0},  # Ball position and velocity
            "paddles": {"player1": {"x": -9.8}, "player2": {"x": 9.8}},    # Paddle X positions
            "scores": {"player1": 0, "player2": 0},                        # Scores
            "players": {},                                                  # Player roles
            "running": False,
            "field": {"width": 20, "height": 30},                          # Game field dimensions (x, z)
            "paddle_length": 3.4,                                          # Paddle length (CapsuleGeometry adjusted)
            "paddle_radius": 0.2,                                          # Paddle radius
            "ball_radius": 0.4                                             # Ball radius
        }
        self.delta_time = 1 / 2  # Match local deltaTime from PongGame

    async def connect(self):
        self.game_group_name = self.scope['url_route']['kwargs']['game_group_name']
        self.user_id = self.scope['user'].username if self.scope['user'].is_authenticated else f"anon_{id(self)}"
        
        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
        await self.accept()

        players = self.game_state["players"]
        if len(players) < 2:
            players[self.user_id] = "player1" if not players else "player2"
            logger.info(f"Player {self.user_id} joined as {players[self.user_id]} in {self.game_group_name}")
        
        if len(players) == 2 and not self.game_state["running"]:
            self.reset_ball()
            self.game_state["running"] = True
            asyncio.create_task(self.game_loop())

        await self.send(text_data=json.dumps({
            "type": "game_init",
            "player_role": players.get(self.user_id),
            "game_state": self.game_state
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
        if self.user_id in self.game_state["players"]:
            del self.game_state["players"][self.user_id]
            self.game_state["running"] = False
        logger.info(f"Player {self.user_id} disconnected from {self.game_group_name} with code: {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"Received from {self.user_id}: {data}")
            
            if data['action'] == 'move':
                player_role = self.game_state["players"].get(self.user_id)
                if player_role:
                    speed = 0.5  # Matches local keyState
                    if data['key'] in ['a', 'ArrowLeft']:
                        self.game_state["paddles"][player_role]["speed_x"] = -speed
                    elif data['key'] in ['d', 'ArrowRight']:
                        self.game_state["paddles"][player_role]["speed_x"] = speed
                    else:
                        self.game_state["paddles"][player_role]["speed_x"] = 0
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON from {self.user_id}: {text_data}")
        except Exception as e:
            logger.error(f"Error in receive: {str(e)}")

    async def game_loop(self):
        while self.game_state["running"]:
            ball = self.game_state["ball"]
            paddles = self.game_state["paddles"]

            # Update paddle positions
            for role in ["player1", "player2"]:
                speed = paddles[role].get("speed_x", 0)
                paddles[role]["x"] += speed * self.delta_time
                paddles[role]["x"] = max(-9.8, min(9.8, paddles[role]["x"]))

            # Update ball position
            next_x = ball["x"] + ball["vx"] * self.delta_time
            next_z = ball["z"] + ball["vz"] * self.delta_time
            ball["x"] = next_x
            ball["z"] = next_z
            ball["y"] = 0  # Fixed height as in local

            # Check paddle collisions
            for role in ["player1", "player2"]:
                if self.check_paddle_collision(role):
                    self.resolve_paddle_collision(role)

            # Wall collisions
            if ball["x"] <= -10:
                ball["x"] = -9.9
                ball["vx"] = abs(ball["vx"])
            elif ball["x"] >= 10:
                ball["x"] = 9.9
                ball["vx"] = -abs(ball["vx"])

            # Scoring
            if ball["z"] < -16:
                self.game_state["scores"]["player2"] += 1
                self.reset_ball()
            elif ball["z"] > 16:
                self.game_state["scores"]["player1"] += 1
                self.reset_ball()

            await self.broadcast_game_state()
            await asyncio.sleep(1/60)  # 60 FPS, smoother than local 1/2

    def check_paddle_collision(self, player_role):
        paddle_x = self.game_state["paddles"][player_role]["x"]
        paddle_z = 0  # Fixed Z position as in local game
        ball_x, ball_z = self.game_state["ball"]["x"], self.game_state["ball"]["z"]
        paddle_half_length = self.game_state["paddle_length"] / 2
        paddle_radius = self.game_state["paddle_radius"]
        ball_radius = self.game_state["ball_radius"]

        distance_x = abs(ball_x - paddle_x)
        distance_z = abs(ball_z - paddle_z)
        if distance_x < paddle_half_length and distance_z < (paddle_radius + ball_radius):
            return True

        left_end_x = paddle_x - paddle_half_length
        right_end_x = paddle_x + paddle_half_length
        dist_left = math.sqrt((ball_x - left_end_x) ** 2 + (ball_z - paddle_z) ** 2)
        dist_right = Math.sqrt((ball_x - right_end_x) ** 2 + (ball_z - paddle_z) ** 2)
        return dist_left < (paddle_radius + ball_radius) or dist_right < (paddle_radius + ball_radius)

    def resolve_paddle_collision(self, player_role):
        ball = self.game_state["ball"]
        paddle_x = self.game_state["paddles"][player_role]["x"]
        push_distance = self.game_state["paddle_radius"] + self.game_state["ball_radius"] + 0.05
        
        # Push ball out of paddle
        ball["z"] = 0 + (ball["vz"] > 0 and -push_distance or push_distance)
        ball["vz"] *= -1

        # Add spin based on hit position
        delta_x = ball["x"] - paddle_x
        ball["vx"] += delta_x * 0.3

        # Ensure minimum speed
        if abs(ball["vx"]) < 0.1:
            ball["vx"] = 0.1 if ball["vx"] > 0 else -0.1

        # Normalize and set speed
        speed = 0.4
        magnitude = math.sqrt(ball["vx"]**2 + ball["vz"]**2)
        if magnitude > 0:
            ball["vx"] = (ball["vx"] / magnitude) * speed
            ball["vz"] = (ball["vz"] / magnitude) * speed

    def reset_ball(self):
        speed = 0.3
        direction = random.choice([1, -1])
        angle = (random.random() - 0.5) * math.pi / 2
        self.game_state["ball"] = {
            "x": 0,
            "y": 0,
            "z": 0,
            "vx": speed * math.sin(angle),
            "vy": 0,
            "vz": direction * speed * math.cos(angle)
        }

    async def broadcast_game_state(self):
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                "type": "game_update",
                "game_state": self.game_state
            }
        )

    async def game_update(self, event):
        state = event["game_state"]
        # Match the format expected by your frontend
        await self.send(text_data=json.dumps({
            "type": "game_update",
            "paddle1_x": state["paddles"]["player1"]["x"],
            "paddle2_x": state["paddles"]["player2"]["x"],
            "ball_x": state["ball"]["x"],
            "ball_z": state["ball"]["z"],
            "ball_vx": state["ball"]["vx"],
            "ball_vz": state["ball"]["vz"],
            "score1": state["scores"]["player1"],
            "score2": state["scores"]["player2"]
        }))