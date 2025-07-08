from rest_framework import serializers
from django.contrib.auth.models import User
from .models import RadioStation, UserProfile, Event, ListeningHistory


class RadioStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadioStation
        fields = [
            'id', 'name', 'description', 'stream_url', 'website_url', 
            'logo', 'country', 'language', 'quality', 'bitrate', 
            'is_active', 'listeners_count', 'created_at', 'updated_at'
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'avatar', 'bio', 'location', 'created_at']


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


class ListeningHistorySerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='station.name', read_only=True)
    station_logo = serializers.ImageField(source='station.logo', read_only=True)

    class Meta:
        model = ListeningHistory
        fields = [
            'id', 'station', 'station_name', 'station_logo', 
            'started_at', 'duration_minutes'
        ]