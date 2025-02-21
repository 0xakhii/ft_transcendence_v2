from django.urls import re_path
from .consumers import PongGameConsumer#, PaddleMovementConsumer

websocket_urlpatterns = [
	# re_path(r'ws/move/$', PaddleMovementConsumer.as_asgi()),
    re_path(r'ws/pong/$', PongGameConsumer.as_asgi()),
]