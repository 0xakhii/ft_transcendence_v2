from django.urls import path
from . import views, const, consumer

urlpatterns = [
	path('game/', views.game_state, name='game_state'),
	path('direction/', views.PaddleMove, name='logic'),
]