from django.urls import path, include
from . import views, const


urlpatterns = [
    path('game/', views.GameInitView.as_view(), name='game_init'),
    path('match-history/', views.MatchHistoryView.as_view(), name='match_history'),
]