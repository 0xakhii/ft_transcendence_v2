import json
from channels.generic.websocket import WebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class GameConsumer(WebsocketConsumer):
    def connect(self):
        logger.info("Connection attempt received")
        try:
            self.accept()
            logger.info("Connection accepted")
            self.send(text_data=json.dumps({
                'message': 'WebSocket connection established'
            }))
        except Exception as e:
            logger.error(f"Connection error: {str(e)}")
            raise

    def disconnect(self, close_code):
        logger.info(f"Disconnected with code: {close_code}")

    def receive(self, text_data):
        logger.info(f"Received data: {text_data}")
        try:
            data = json.loads(text_data)
            self.send(text_data=json.dumps({
                'message': 'Data received',
                'data': data
            }))
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class GameConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Accept the WebSocket connection
#         self.room_name = "test"
#         self.room_group_name = f"ws_{self.room_name}"

#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         # Leave the group when the WebSocket closes
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         # Handle the incoming WebSocket message
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     async def send(self, event):
#         # Send message to WebSocket
#         message = event['message']
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))
