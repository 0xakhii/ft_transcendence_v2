from django.urls import path
from . import views, const

urlpatterns = [
	path('game/', views.game_state, name='game_state'),
]