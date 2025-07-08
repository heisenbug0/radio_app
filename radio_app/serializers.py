from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import RadioStation, UserProfile


class RadioStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadioStation
        fields = [
            'id', 'name', 'description', 'stream_url', 'website_url',
            'logo', 'country', 'language', 'quality', 'bitrate',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'avatar', 'bio', 'location', 'created_at']
        read_only_fields = ['user', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


# Radiojar API Response Serializers
class NowPlayingSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    title = serializers.CharField()
    artist = serializers.CharField()
    album = serializers.CharField(allow_blank=True)
    artwork = serializers.URLField(allow_blank=True)
    duration = serializers.IntegerField()
    started_at = serializers.CharField(allow_blank=True)
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class ScheduleItemSerializer(serializers.Serializer):
    show_id = serializers.CharField()
    show_title = serializers.CharField()
    show_description = serializers.CharField(allow_blank=True)
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    host_name = serializers.CharField(allow_blank=True)
    is_live = serializers.BooleanField()


class ScheduleSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    schedule = ScheduleItemSerializer(many=True)
    current_show = ScheduleItemSerializer(required=False, allow_null=True)
    next_show = ScheduleItemSerializer(required=False, allow_null=True)
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class StatisticsSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    current_listeners = serializers.IntegerField()
    peak_listeners = serializers.IntegerField()
    total_listeners_today = serializers.IntegerField()
    listening_time_avg = serializers.FloatField()
    top_countries = serializers.ListField(child=serializers.DictField())
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class TrackSerializer(serializers.Serializer):
    title = serializers.CharField()
    artist = serializers.CharField()
    album = serializers.CharField(allow_blank=True)
    played_at = serializers.DateTimeField()
    duration = serializers.IntegerField()
    artwork = serializers.URLField(allow_blank=True)


class SongHistorySerializer(serializers.Serializer):
    success = serializers.BooleanField()
    tracks = TrackSerializer(many=True)
    total_count = serializers.IntegerField()
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class DJSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    nickname = serializers.CharField(allow_blank=True)
    bio = serializers.CharField(allow_blank=True)
    photo = serializers.URLField(allow_blank=True)
    social_links = serializers.DictField()


class DJListSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    djs = DJSerializer(many=True)
    total_count = serializers.IntegerField()
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class ShowSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    host_name = serializers.CharField(allow_blank=True)
    schedule = serializers.CharField(allow_blank=True)
    image = serializers.URLField(allow_blank=True)
    is_featured = serializers.BooleanField()


class ShowListSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    shows = ShowSerializer(many=True)
    featured_shows = ShowSerializer(many=True)
    total_count = serializers.IntegerField()
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class SongRequestSerializer(serializers.Serializer):
    song_title = serializers.CharField(max_length=200)
    artist = serializers.CharField(max_length=200, allow_blank=True)
    message = serializers.CharField(max_length=500, allow_blank=True)
    listener_name = serializers.CharField(max_length=100, allow_blank=True)


class SongRequestResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    message = serializers.CharField()
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)


class StationInfoSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    station_name = serializers.CharField()
    description = serializers.CharField()
    website = serializers.URLField(allow_blank=True)
    logo = serializers.URLField(allow_blank=True)
    stream_url = serializers.URLField()
    stream_name = serializers.CharField()
    timestamp = serializers.DateTimeField()
    error = serializers.CharField(required=False, allow_blank=True)