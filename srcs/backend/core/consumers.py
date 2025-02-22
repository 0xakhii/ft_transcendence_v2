import json
from channels.generic.websocket import AsyncWebsocketConsumer
from usermanage.models import User
from asgiref.sync import sync_to_async

class PongGameConsumer(AsyncWebsocketConsumer):
    players = {}

    async def connect(self):
        self.user = User.scope["user"]
        if self.user.is_authenticated:
            print(f" User {self.user.username} connected.")
            await self.accept()
        else:
            print(" Unauthorized user tried to connect.")
            await self.close()

        self.players[self.channel_name] = {"x": 0, "y": 0, "z": -10}
        await self.send_state()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            print(f" User {self.user.username} disconnected.")
        else:
            print("An unauthenticated user disconnected.")

        if self.channel_name in self.players:
            del self.players[self.channel_name]

    async def receive(self, text_data):
        data = json.loads(text_data)

        if "action" in data:
            if data["action"] == "moveUp":
                self.players[self.channel_name]["y"] += 0.5
            elif data["action"] == "moveDown":
                self.players[self.channel_name]["y"] -= 0.5
            elif data["action"] == "stop":
                pass

        await self.send_state()

    async def send_state(self):
        state = {
            "RightPaddle": self.players.get(self.channel_name, {"x": 0, "y": 0, "z": -10}),
            "LeftPaddle": {"x": 0, "y": 0, "z": 5},
            "Ball": {"x": 0, "y": 0, "z": 0}
        }
        await self.send(text_data=json.dumps(state))
