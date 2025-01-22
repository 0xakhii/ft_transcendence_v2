from django.urls import path, re_path
from .consumer import GameConsumer
from . import views, const, consumer

urlpatterns = [
	path('game/', views.game_state, name='game_state'),
	path('direction/', views.PaddleMove, name='logic'),
    # re_path('ws/test/', GameConsumer.as_asgi()),
]