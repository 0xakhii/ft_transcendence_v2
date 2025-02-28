import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import asyncio
import logging

logger = logging.getLogger(__name__)

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['user'].username if self.scope['user'].is_authenticated else f"anon_{id(self)}"
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add("matchmaking", self.channel_name)
        await self.send(text_data=json.dumps({
            "type": "connected",
            "user_id": self.user_id
        }))
        await self.accept()
        logger.info(f"Player {self.user_id} connected - Channel: {self.channel_name}")

    async def disconnect(self):
        await self.channel_layer.group_discard("matchmaking", self.channel_name)
        logger.info(f"Player {self.user_id} disconnected")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"Received message from {self.user_id}: {data}")
            
            if data['action'] == 'join_queue':
                await self.join_queue(data)
                await self.channel_layer.group_send(
                    "matchmaking",
                    {
                        "type": "join_queue",
                        "user_id": self.user_id,
                        "channel_name": self.channel_name
                    }
                )
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON from {self.user_id}: {text_data}")
        except Exception as e:
            logger.error(f"Error in receive for {self.user_id}: {str(e)}")

    async def join_queue(self, event):
        user_id = event["user_id"]
        # channel_name = event["channel_name"]
        
        # Prevent duplicate entries
        # current_size = await self.get_queue_size()
        if user_id in await self.get_queue_contents():  # Add this helper method
            logger.info(f"User {user_id} already in queue")
            return

        await self.add_to_queue(user_id)
        await self.send(text_data=json.dumps({
            "type": "joined_queue",
            "user_id": user_id
        }))
        
        queue_size = await self.get_queue_size()
        logger.info(f"Current queue state - Size: {queue_size}, User: {user_id}")

        if queue_size >= 2:
            player1_id = await self.get_first_in_queue()
            player2_id = await self.get_first_in_queue()  # Get second player
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

    # Add helper method
    async def get_queue_contents(self):
        result = await self.channel_layer.send(
            "redis",
            {
                "type": "redis_command",
                "command": "LRANGE",
                "args": ["matchmaking_queue", "0", "-1"]
            }
        )
        return result.get("value", []) if result else []

    async def match_found(self, event):
        data = event["data"]
        logger.info(f"Sending match_found to {self.user_id}: {data}")
        await self.send(text_data=json.dumps(data))

    async def remove_from_queue(self, event):
        user_id = event["user_id"]
        await self.remove_user_from_queue(user_id)
        logger.info(f"Removed {user_id} from queue on disconnect")

    async def get_queue_size(self):
        result = await self.channel_layer.send(
            "redis",  # Use consistent channel name
            {
                "type": "redis_command",
                "command": "LLEN",
                "args": ["matchmaking_queue"]
            }
        )
        size = int(result.get("value", 0)) if result else 0
        logger.info(f"Queue size retrieved: {size}")
        return size

    async def add_to_queue(self, user_id):
        await self.channel_layer.send(
            "redis",
            {
                "type": "redis_command",
                "command": "RPUSH",
                "args": ["matchmaking_queue", user_id]
            }
        )
        # Verify addition
        size = await self.get_queue_size()
        logger.info(f"Added {user_id} to queue, new size: {size}")

    async def get_first_in_queue(self):
        result = await self.channel_layer.send(
            "redis",
            {
                "type": "redis_command",
                "command": "LPOP",
                "args": ["matchmaking_queue"]
            }
        )
        first = result.get("value") if result and "value" in result else None
        logger.info(f"Popped from queue: {first}")
        return first

    async def remove_user_from_queue(self, user_id):
        await self.channel_layer.send("redis", {
            "type": "redis_command",
            "command": "LREM",
            "args": ["matchmaking_queue", "1", user_id]
        })
        logger.info(f"Removed {user_id} from queue")

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