from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator


class RadioStation(models.Model):
    QUALITY_CHOICES = [
        ('low', 'Low (64kbps)'),
        ('medium', 'Medium (128kbps)'),
        ('high', 'High (256kbps)'),
        ('ultra', 'Ultra (320kbps)'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    stream_url = models.URLField(validators=[URLValidator()])
    website_url = models.URLField(blank=True)
    logo = models.ImageField(upload_to='station_logos/', blank=True, null=True)
    country = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    quality = models.CharField(max_length=10, choices=QUALITY_CHOICES, default='medium')
    bitrate = models.IntegerField(default=128)  # in kbps
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"