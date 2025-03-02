# from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class MatchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='local_matches')
    player1_username = models.CharField(max_length=150)
    player2_username = models.CharField(max_length=150)
    score1 = models.IntegerField()
    score2 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.player1_username} vs {self.player2_username} ({self.score1}-{self.score2})"