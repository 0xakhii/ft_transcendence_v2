from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


DEFAULT_AVATAR_URL = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    email = models.CharField(max_length=255,null=True,unique=True)
    first_name = models.CharField(max_length=255,null=True)
    last_name = models.CharField(max_length=255,null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, default=DEFAULT_AVATAR_URL)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(default=timezone.now)
    is_online = models.BooleanField(default=False)
    #addthis
    def update_activity(self):
        self.last_activity = timezone.now()
        self.save(update_fields=['last_activity'])  # Ensure this commits
        # Verify in DB
        updated_profile = Profile.objects.get(id=self.id)
    #addthis
    @property
    def online_status(self):
        time_threshold = timezone.now() - timezone.timedelta(minutes=5)
        is_online = self.last_activity >= time_threshold
        logger.info(f"Calculating online_status for {self.user.username}: last_activity={self.last_activity}, now={timezone.now()}, threshold={time_threshold}, result={is_online}")
        return is_online

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)
        profile.email = instance.email
        profile.first_name = instance.first_name
        profile.last_name = instance.last_name
        profile.save()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    profile = instance.profile
    profile.email = instance.email
    profile.first_name = instance.first_name
    profile.last_name = instance.last_name
    profile.save()

class FriendRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    )
        
    sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    class Meta:
        unique_together = ('sender', 'receiver')

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.status})"


