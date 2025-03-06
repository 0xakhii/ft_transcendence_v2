from django.urls import path, include
from . import views, const
from .views import NumberTapMatchHistoryView

urlpatterns = [
    path('game/', views.GameInitView.as_view(), name='game_init'),
    path('match-history/', views.MatchHistoryView.as_view(), name='match_history'),
    path('number-tap-history/', NumberTapMatchHistoryView.as_view(), name='number_tap_history'),
]