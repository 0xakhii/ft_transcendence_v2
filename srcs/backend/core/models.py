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
    result = models.CharField(max_length=50, null=True, default="pending")

    def __str__(self):
        return f"{self.user.username}: {self.player1_username} vs {self.player2_username} ({self.score1}-{self.score2}) - {self.result}"


class NumberTapMatch(models.Model):
    player1 = models.ForeignKey(User, related_name='number_tap_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='number_tap_player2', on_delete=models.CASCADE, null=True, blank=True)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    winner = models.ForeignKey(User, related_name='number_tap_wins', on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.player1_score > self.player2_score:
            self.winner = self.player1
        elif self.player2_score > self.player1_score:
            self.winner = self.player2
        super().save(*args, **kwargs)
