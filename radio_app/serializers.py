from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Category, RadioStation, UserProfile, Event, 
    BlogPost, ListeningHistory, Contact
)


class CategorySerializer(serializers.ModelSerializer):
    stations_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'stations_count', 'created_at']

    def get_stations_count(self, obj):
        return obj.stations.filter(is_active=True).count()


class RadioStationSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = RadioStation
        fields = [
            'id', 'name', 'description', 'stream_url', 'website_url', 
            'logo', 'category', 'category_name', 'country', 'language', 
            'quality', 'bitrate', 'is_active', 'listeners_count', 
            'is_favorited', 'created_at', 'updated_at'
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    favorite_stations = RadioStationSerializer(many=True, read_only=True)
    favorite_stations_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'avatar', 'bio', 'location', 
            'favorite_stations', 'favorite_stations_count', 'created_at'
        ]

    def get_favorite_stations_count(self, obj):
        return obj.favorite_stations.count()


class EventSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='station.name', read_only=True)
    is_live = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'station', 'station_name', 
            'event_type', 'start_time', 'end_time', 'host', 'image', 
            'is_featured', 'is_live', 'is_upcoming', 'created_at'
        ]


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author', 
            'author_name', 'author_username', 'featured_image', 'status', 
            'tags', 'tags_list', 'is_featured', 'created_at', 
            'updated_at', 'published_at'
        ]

    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',')]
        return []


class ListeningHistorySerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='station.name', read_only=True)
    station_logo = serializers.ImageField(source='station.logo', read_only=True)

    class Meta:
        model = ListeningHistory
        fields = [
            'id', 'station', 'station_name', 'station_logo', 
            'started_at', 'duration_minutes'
        ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'subject', 'message', 
            'is_resolved', 'created_at'
        ]
        read_only_fields = ['id', 'is_resolved', 'created_at']