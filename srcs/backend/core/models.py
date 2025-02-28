# from django.db import models

# Create your models here.
import random
import json
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from django.db import models

from django.contrib.auth.models import User

class MatchHistory(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1_matches')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player2_matches')
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} - {self.score1}:{self.score2}"