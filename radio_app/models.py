from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import URLValidator


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # For emoji or icon class
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


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
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='stations')
    country = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    quality = models.CharField(max_length=10, choices=QUALITY_CHOICES, default='medium')
    bitrate = models.IntegerField(default=128)  # in kbps
    is_active = models.BooleanField(default=True)
    listeners_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-listeners_count', 'name']

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    favorite_stations = models.ManyToManyField(RadioStation, blank=True, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Event(models.Model):
    EVENT_TYPES = [
        ('live_show', 'Live Show'),
        ('interview', 'Interview'),
        ('music_special', 'Music Special'),
        ('news', 'News'),
        ('sports', 'Sports'),
        ('talk_show', 'Talk Show'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    station = models.ForeignKey(RadioStation, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    host = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.title} - {self.station.name}"

    @property
    def is_live(self):
        now = timezone.now()
        return self.start_time <= now <= self.end_time

    @property
    def is_upcoming(self):
        return self.start_time > timezone.now()


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=300, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    featured_image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class ListeningHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listening_history')
    station = models.ForeignKey(RadioStation, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    duration_minutes = models.IntegerField(default=0)  # How long they listened

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} listened to {self.station.name}"


class Contact(models.Model):
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('technical', 'Technical Support'),
        ('content', 'Content Suggestion'),
        ('partnership', 'Partnership'),
        ('feedback', 'Feedback'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"