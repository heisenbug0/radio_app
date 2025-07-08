from rest_framework import serializers
from django.contrib.auth.models import User
from .models import RadioStation, UserProfile


class RadioStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadioStation
        fields = [
            'id', 'name', 'description', 'stream_url', 'website_url', 
            'logo', 'country', 'language', 'quality', 'bitrate', 
            'is_active', 'created_at', 'updated_at'
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