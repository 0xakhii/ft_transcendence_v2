from django.urls import path, include
from . import views, const
urlpatterns = [
	path('game/', views.game_state, name='game_state'),
	path('direction/', views.PaddleMove, name='logic'),
]