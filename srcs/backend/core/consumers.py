import json
import redis.asyncio as aioredis
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import asyncio
import logging
import os

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
        # First establish WebSocket connection
        await self.accept()
        
        # Set user_id after acceptance
        self.user_id = self.scope['user'].username if self.scope['user'].is_authenticated else f"anon_{id(self)}"
        
        # Attempt Redis connection with retry logic
        max_retries = 5
        retry_delay = 2  # seconds
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

        # Add to channel group after successful setup
        await self.channel_layer.group_add("matchmaking", self.channel_name)
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            "type": "connected",
            "user_id": self.user_id
        }))
        logger.info(f"Player {self.user_id} connected - Channel: {self.channel_name}")

    async def disconnect(self):
        if self.channel_layer and self.channel_name:
            await self.channel_layer.group_discard("matchmaking", self.channel_name)
        if self.redis:
            await self.redis.close()
        logger.info(f"Player {self.user_id} disconnected")

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
    async def connect(self):
        self.game_group_name = self.scope['url_route']['kwargs']['game_group_name']
        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self):
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data['action'] == 'move':
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'game_update',
                    'action': 'move',
                    'key': data['key'],
                    'player_id': self.scope['user'].username if self.scope['user'].is_authenticated else None
                }
            )

    async def game_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_update',
            'action': event['action'],
            'key': event['key'],
            'player_id': event['player_id']
        }))

    @database_sync_to_async
    def store_match_history(self, match_data):
        from .models import MatchHistory
        MatchHistory.objects.create(
            player1_id=match_data['player1_id'],
            player2_id=match_data['player2_id'],
            score1=match_data['score1'],
            score2=match_data['score2'],
        )