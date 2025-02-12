import json
from channels.generic.websocket import WebsocketConsumer

class GameConsumer(WebsocketConsumer):
    def connect(self):
        print("Connection attempt received")
        try:
            self.accept()
            print("Connection accepted")
            self.send(text_data=json.dumps({
                'message': 'WebSocket connection established'
            }))
        except Exception as e:
            print(f"Connection error: {str(e)}")
            raise

    def disconnect(self, close_code):
        print(f"Disconnected with code: {close_code}")

    def receive(self, text_data):
        print(f"Received data: {text_data}")
        try:
            data = json.loads(text_data)
            self.send(text_data=json.dumps({
                'message': 'Data received',
                'data': data
            }))
        except Exception as e:
            print(f"Error processing message: {str(e)}")
    # def send(self , message):
    #     self.send(text_data=json.dumps(message))
