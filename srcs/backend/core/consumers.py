import json
import redis.asyncio as aioredis
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
import asyncio
import logging
import os
import time
import random
import math
import jwt
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken, TokenError

logger = logging.getLogger(__name__)

class MatchmakingConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redis = None
        self.redis_host = os.environ.get('REDIS_HOST', 'redis')
        self.redis_port = int(os.environ.get('REDIS_PORT', 6379))
        self.user_id = None
        self.channel_layer = get_channel_layer()
        self.auth_token = None

    async def connect(self):
        await self.accept()
        self.user_id = self.scope['user'].username if self.scope['user'].is_authenticated else f"anon_{id(self)}"
        max_retries = 5
        retry_delay = 2
        for attempt in range(max_retries):
            try:
                self.redis = await aioredis.from_url(f"redis://{self.redis_host}:{self.redis_port}")
                break
            except Exception as e:
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
                self.auth_token = data.get('authToken')
                await self.join_queue(data)
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON from {self.user_id}: {text_data}")
        except Exception as e:
            logger.error(f"Error in receive for {self.user_id}: {str(e)}")

    @database_sync_to_async
    def validate_token(self, token):
        """Validate the JWT token and return the username."""
        try:
            access_token = AccessToken(token)
            user = get_user_model().objects.get(id=access_token['user_id'])
            return user.username
        except (TokenError, get_user_model().DoesNotExist) as e:
            logger.error(f"Token validation failed: {str(e)}")
            return None

    async def join_queue(self, event):
        try:
            validated_username = await self.validate_token(self.auth_token)
            if not validated_username:
                await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "Invalid authentication token"
                }))
                return

            self.user_id = validated_username
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

            if queue_size >= 2:
                player1_id = await self.get_first_in_queue()
                player2_id = await self.get_first_in_queue()
                if player1_id and player2_id:
                    game_group_name = f"game_{player1_id}_{player2_id}_{int(asyncio.get_event_loop().time())}"
                    
                    your_role = "player1" if self.user_id == player1_id else "player2"

                    match_data = {
                        "type": "match_found",
                        "player1_id": player1_id,
                        "player2_id": player2_id,
                        "game_group_name": game_group_name,
                        "your_role": your_role
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
        self.redis = None
        self.redis_host = os.environ.get('REDIS_HOST', 'redis')
        self.redis_port = int(os.environ.get('REDIS_PORT', 6379))
        self.channel_layer = get_channel_layer()
        self.loop_task = None

    async def connect(self):
        self.game_group_name = self.scope['url_route']['kwargs']['game_group_name']
        self.user_id = self.scope['user'].username if self.scope['user'].is_authenticated else f"anon_{id(self)}"
        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
        await self.accept()

        self.redis = await aioredis.from_url(f"redis://{self.redis_host}:{self.redis_port}")

        game_state_key = f"game_state:{self.game_group_name}"
        lock_key = f"lock:{self.game_group_name}"
        async with self.redis.lock(lock_key, timeout=5):
            stored_state = await self.redis.get(game_state_key)
            if stored_state:
                self.game_state = json.loads(stored_state)
            else:
                self.game_state = {
                    "ball": {"x": 0, "y": 0, "z": 0, "vx": 0.09, "vy": 0, "vz": 0.09},
                    "paddles": {"player1": {"x": 0, "z": -15, "speed_x": 0}, "player2": {"x": 0, "z": 15, "speed_x": 0}},
                    "scores": {"player1": 0, "player2": 0},
                    "players": {},
                    "running": False,
                    "field": {"width": 20, "height": 30},
                    "paddle_length": 3.4,
                    "paddle_radius": 0.2,
                    "ball_radius": 0.4
                }

            players = self.game_state["players"]
            if len(players) < 2:
                player_role = "player1" if not players else "player2"
                players[self.user_id] = player_role
            else:
                await self.close()
                return

            await self.redis.set(game_state_key, json.dumps(self.game_state))

        await self.send(text_data=json.dumps({
            "type": "game_init",
            "player_role": players.get(self.user_id),
            "game_state": self.game_state
        }))

        if len(players) == 2:
            async with self.redis.lock(lock_key, timeout=5):
                stored_state = await self.redis.get(game_state_key)
                self.game_state = json.loads(stored_state)
                if not self.game_state["running"]:
                    self.game_state["running"] = True
                    self.reset_ball()
                    await self.redis.set(game_state_key, json.dumps(self.game_state))
                    self.loop_task = asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
        game_state_key = f"game_state:{self.game_group_name}"
        lock_key = f"lock:{self.game_group_name}"
        async with self.redis.lock(lock_key, timeout=5):
            stored_state = await self.redis.get(game_state_key)
            if stored_state:
                self.game_state = json.loads(stored_state)
                self.game_state["players"] = {}
                self.game_state["running"] = False
                self.game_state["scores"] = {"player1": 0, "player2": 0}
                await self.redis.delete(game_state_key)
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {"type": "game_ended", "message": "Opponent disconnected, game ended"}
                )
        if self.loop_task and not self.loop_task.done():
            self.loop_task.cancel()
        await self.redis.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['action'] == 'move':
            game_state_key = f"game_state:{self.game_group_name}"
            lock_key = f"lock:{self.game_group_name}"
            async with self.redis.lock(lock_key, timeout=5):
                stored_state = await self.redis.get(game_state_key)
                if stored_state:
                    self.game_state = json.loads(stored_state)
                    player_role = self.game_state["players"].get(self.user_id)
                    if player_role:
                        speed = 0.3
                        if player_role == "player1":
                            if data['key'] in ['a', 'ArrowLeft']:
                                self.game_state["paddles"][player_role]["speed_x"] = -speed
                            elif data['key'] in ['d', 'ArrowRight']:
                                self.game_state["paddles"][player_role]["speed_x"] = speed
                            else:
                                self.game_state["paddles"][player_role]["speed_x"] = 0
                        elif player_role == "player2":
                            if data['key'] in ['a', 'ArrowLeft']:
                                self.game_state["paddles"][player_role]["speed_x"] = speed
                            elif data['key'] in ['d', 'ArrowRight']:
                                self.game_state["paddles"][player_role]["speed_x"] = -speed
                            else:
                                self.game_state["paddles"][player_role]["speed_x"] = 0
                        await self.redis.set(game_state_key, json.dumps(self.game_state))

    async def game_loop(self):
        game_state_key = f"game_state:{self.game_group_name}"
        lock_key = f"lock:{self.game_group_name}"
        while True:
            async with self.redis.lock(lock_key, timeout=5):
                stored_state = await self.redis.get(game_state_key)
                if not stored_state or not json.loads(stored_state)["running"]:
                    break
                self.game_state = json.loads(stored_state)
                if len(self.game_state["players"]) != 2:
                    self.game_state["running"] = False
                    await self.redis.set(game_state_key, json.dumps(self.game_state))
                    break

                ball = self.game_state["ball"]
                paddles = self.game_state["paddles"]

                prev_x, prev_z = ball["x"], ball["z"]

                for role in ["player1", "player2"]:
                    speed = paddles[role]["speed_x"]
                    paddles[role]["x"] += speed
                    paddles[role]["x"] = max(-9.8, min(9.8, paddles[role]["x"]))

                ball["x"] += ball["vx"]
                ball["z"] += ball["vz"]

                if ball["x"] <= -10:
                    ball["x"] = -9.9
                    ball["vx"] = abs(ball["vx"])
                elif ball["x"] >= 10:
                    ball["x"] = 9.9
                    ball["vx"] = -abs(ball["vx"])

                for role in ["player1", "player2"]:
                    if self.check_paddle_collision_continuous(role, prev_x, prev_z, ball["x"], ball["z"]):
                        self.resolve_paddle_collision(role)

                if ball["z"] < -16:
                    self.game_state["scores"]["player2"] += 1
                    self.reset_ball()
                elif ball["z"] > 16:
                    self.game_state["scores"]["player1"] += 1
                    self.reset_ball()

                await self.redis.set(game_state_key, json.dumps(self.game_state))

            await self.broadcast_game_state()
            await asyncio.sleep(1 / 60)

    async def broadcast_game_state(self):
        await self.channel_layer.group_send(
            self.game_group_name,
            {"type": "game_update", "game_state": self.game_state}
        )

    def check_paddle_collision_continuous(self, player_role, prev_x, prev_z, curr_x, curr_z):
        paddle = self.game_state["paddles"][player_role]
        ball_radius = self.game_state["ball_radius"]
        paddle_radius = self.game_state["paddle_radius"]
        paddle_half_length = self.game_state["paddle_length"] / 2

        paddle_left = paddle["x"] - paddle_half_length
        paddle_right = paddle["x"] + paddle_half_length
        paddle_z_min = paddle["z"] - paddle_radius
        paddle_z_max = paddle["z"] + paddle_radius

        if prev_z < paddle_z_min and curr_z >= paddle_z_min or prev_z > paddle_z_max and curr_z <= paddle_z_max:
            t = (paddle["z"] - prev_z) / (curr_z - prev_z)
            if 0 <= t <= 1:
                intersect_x = prev_x + t * (curr_x - prev_x)
                if paddle_left - ball_radius <= intersect_x <= paddle_right + ball_radius:
                    self.game_state["ball"]["x"] = intersect_x
                    self.game_state["ball"]["z"] = paddle["z"] + (self.game_state["ball"]["vz"] > 0 and -ball_radius - paddle_radius or ball_radius + paddle_radius)
                    self.game_state["ball"]["vz"] *= -1
                    return True
        return self.check_paddle_collision(player_role)

    def check_paddle_collision(self, player_role):
        paddle = self.game_state["paddles"][player_role]
        ball_radius = self.game_state["ball_radius"]
        paddle_radius = self.game_state["paddle_radius"]
        ball = self.game_state["ball"]
        paddle_half_length = self.game_state["paddle_length"] / 2
        distance_x = abs(ball["x"] - paddle["x"])
        distance_z = abs(ball["z"] - paddle["z"])
        if distance_x < paddle_half_length and distance_z < (paddle_radius + ball_radius):
            return True
        return False

    def resolve_paddle_collision(self, player_role):
        ball = self.game_state["ball"]
        paddle = self.game_state["paddles"][player_role]
        ball_radius = self.game_state["ball_radius"]
        paddle_radius = self.game_state["paddle_radius"]

        push_distance = paddle_radius + ball_radius + 0.01
        ball["z"] = paddle["z"] + (ball["vz"] > 0 and -push_distance or push_distance)
        ball["vz"] *= -1
        delta_x = ball["x"] - paddle["x"]
        ball["vx"] += delta_x * 0.03 
        if abs(ball["vx"]) < 0.01: 
            ball["vx"] = ball["vx"] > 0 and 0.01 or -0.01
        magnitude = math.sqrt(ball["vx"]**2 + ball["vz"]**2)
        if magnitude > 0:
            ball["vx"] = (ball["vx"] / magnitude) * 0.2
            ball["vz"] = (ball["vz"] / magnitude) * 0.2

    def reset_ball(self):
        speed = 0.3
        direction = random.choice([1, -1])
        angle = (random.random() - 0.5) * math.pi / 2
        self.game_state["ball"] = {
            "x": 0, "y": 0, "z": 0,
            "vx": speed * math.sin(angle),
            "vy": 0,
            "vz": direction * speed * math.cos(angle)
        }

    async def game_update(self, event):
        state = event["game_state"]
        await self.send(text_data=json.dumps({
            "type": "game_update",
            "paddle1_x": state["paddles"]["player1"]["x"],
            "paddle2_x": state["paddles"]["player2"]["x"],
            "ball_x": state["ball"]["x"],
            "ball_z": state["ball"]["z"],
            "ball_velocity_x": state["ball"]["vx"],
            "ball_velocity_z": state["ball"]["vz"],
            "score1": state["scores"]["player1"],
            "score2": state["scores"]["player2"]
        }))

    async def game_ended(self, event):
        await self.send(text_data=json.dumps({
            "type": "game_ended",
            "message": event["message"]
        }))

import uuid

class FriendsMatchConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redis = None
        self.redis_host = os.environ.get('REDIS_HOST', 'redis')
        self.redis_port = int(os.environ.get('REDIS_PORT', 6379))
        self.user_id = None
        self.is_authenticated = False
        self.instance_id = str(uuid.uuid4())
        self.channel_layer = get_channel_layer()

    async def connect(self):
        await self.accept()
        try:
            self.redis = await aioredis.from_url(f"redis://{self.redis_host}:{self.redis_port}")
            pong = await self.redis.ping()
            if not pong:
                raise Exception("Redis ping failed")
            logger.info(f"Instance {self.instance_id}: Connected to Redis")
        except Exception as e:
            logger.error(f"Instance {self.instance_id}: Redis connection failed: {e}")
            await self.send(json.dumps({"type": "error", "message": "Server error, Redis unavailable"}))
            await self.close()
            return
        await self.channel_layer.group_add("friends_lobby", self.channel_name)
        logger.info(f"Instance {self.instance_id}: Joined friends_lobby at {self.channel_name}")

    async def disconnect(self, close_code):
        if self.is_authenticated and self.user_id:
            await self.redis.hdel("connected_users", self.user_id)
            logger.info(f"Instance {self.instance_id}: Removed {self.user_id} from connected_users")
        await self.channel_layer.group_discard("friends_lobby", self.channel_name)
        if self.redis:
            await self.redis.close()
        logger.info(f"Instance {self.instance_id}: Disconnected, code: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        logger.info(f"Instance {self.instance_id}: Received: {data}")

        if action == "authenticate":
            await self.handle_authenticate(data)
        elif not self.is_authenticated:
            await self.send(json.dumps({"type": "error", "message": "Authentication required"}))
            return
        elif action == "invite_friend":
            await self.handle_invite_friend(data)
        elif action == "accept_invite":
            await self.handle_accept_invite(data)

    @database_sync_to_async
    def validate_token(self, token):
        try:
            access_token = AccessToken(token)
            user = get_user_model().objects.get(id=access_token['user_id'])
            return user.username
        except Exception as e:
            logger.error(f"Instance {self.instance_id}: Token validation failed: {e}")
            return None

    async def handle_authenticate(self, data):
        auth_token = data.get('authToken')
        if not auth_token:
            await self.send(json.dumps({"type": "error", "message": "No token provided"}))
            await self.close()
            return

        self.user_id = await self.validate_token(auth_token)
        if not self.user_id:
            await self.send(json.dumps({"type": "error", "message": "Invalid token"}))
            await self.close()
            return

        self.is_authenticated = True
        await self.redis.hset("connected_users", self.user_id, self.channel_name)
        logger.info(f"Instance {self.instance_id}: Authenticated {self.user_id}")
        await self.send(json.dumps({"type": "authenticated", "message": "Authentication successful"}))

    async def handle_invite_friend(self, data):
        friend_username = data.get('friend_username')
        if not friend_username:
            await self.send(json.dumps({"type": "error", "message": "Friend username required"}))
            return

        friend_channel = await self.redis.hget("connected_users", friend_username)
        invite_key = f"invite:{self.user_id}:{friend_username}"
        await self.redis.set(invite_key, self.user_id, ex=600)
        logger.info(f"Instance {self.instance_id}: Stored invite {invite_key} in Redis")

        if not friend_channel:
            await self.send(json.dumps({"type": "waiting", "message": f"{friend_username} is not online"}))
            return

        friend_channel = friend_channel.decode('utf-8')
        logger.info(f"Instance {self.instance_id}: Inviting {friend_username} at {friend_channel}")
        await self.channel_layer.send(friend_channel, {
            "type": "invite_received",
            "inviter": self.user_id,
        })
        await self.send(json.dumps({"type": "invite_sent", "message": f"Invite sent to {friend_username}"}))

    async def handle_accept_invite(self, data):
        inviter_id = data.get('inviter')
        if not inviter_id:
            await self.send(json.dumps({"type": "error", "message": "Inviter required"}))
            return

        inviter_channel = await self.redis.hget("connected_users", inviter_id)
        if not inviter_channel:
            await self.send(json.dumps({"type": "error", "message": "Inviter is no longer online"}))
            return

        invite_key = f"invite:{inviter_id}:{self.user_id}"
        for _ in range(3):
            stored_inviter = await self.redis.get(invite_key)
            if stored_inviter:
                break
            await asyncio.sleep(0.1)
        if not stored_inviter or stored_inviter.decode('utf-8') != inviter_id:
            await self.send(json.dumps({"type": "error", "message": "No valid invite found"}))
            return

        await self.redis.delete(invite_key)
        await self.start_friends_match(inviter_id, self.user_id)

        inviter_channel = await self.redis.hget("connected_users", inviter_id)
        if not inviter_channel:
            await self.send(json.dumps({"type": "error", "message": "Inviter is no longer online"}))
            return

        invite_key = f"invite:{inviter_id}:{self.user_id}"
        if not await self.redis.get(invite_key):
            await self.send(json.dumps({"type": "error", "message": "No valid invite found"}))
            return
        await self.redis.delete(invite_key)
        await self.start_friends_match(inviter_id, self.user_id)

    async def start_friends_match(self, player1_id, player2_id):
        game_group_name = f"game_{player1_id}_{player2_id}_{int(time.time())}"
        match_data = {
            "type": "match_found",
            "player1_id": player1_id,
            "player2_id": player2_id,
            "game_group_name": game_group_name,
        }

        inviter_channel = (await self.redis.hget("connected_users", player1_id)).decode('utf-8')
        invitee_channel = (await self.redis.hget("connected_users", player2_id)).decode('utf-8')

        await self.channel_layer.send(inviter_channel, {"type": "match_found", "data": match_data})
        await self.channel_layer.send(invitee_channel, {"type": "match_found", "data": match_data})
        logger.info(f"Instance {self.instance_id}: Started match {game_group_name}")

    async def invite_received(self, event):
        logger.info(f"Instance {self.instance_id}: Invite received for {self.user_id} from {event['inviter']}")
        await self.send(json.dumps({
            "type": "invite_received",
            "inviter": event["inviter"],
        }))

    async def match_found(self, event):
        logger.info(f"Instance {self.instance_id}: Match found for {self.user_id}")
        await self.send(json.dumps(event["data"]))