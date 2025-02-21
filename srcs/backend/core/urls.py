from django.urls import path, include
from . import views, const
urlpatterns = [
	path('game/', views.game_state_init, name='game_state'),
]