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