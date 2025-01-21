# from django.urls import re_path
from .consumer import GameConsumer

websocket_urlpatterns = [
    path('ws/test/', GameConsumer.as_asgi()),
]

