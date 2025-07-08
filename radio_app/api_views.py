from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
import logging

from .radiojar_api import RadiojarAPIClient
from .serializers import (
    UserRegistrationSerializer, LoginSerializer, UserSerializer,
    NowPlayingSerializer, ScheduleSerializer, StatisticsSerializer,
    SongHistorySerializer, DJListSerializer, ShowListSerializer,
    SongRequestSerializer, SongRequestResponseSerializer,
    StationInfoSerializer
)

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    """
    User registration endpoint for React Native app.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    User login endpoint for React Native app.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh),
                }
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    Get and update user profile.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        })
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'user': serializer.data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# Radiojar API Proxy Views
class RadiojarBaseView(APIView):
    """
    Base view for Radiojar API proxy endpoints.
    """
    permission_classes = [permissions.AllowAny]  # Public radio data
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.radiojar_client = RadiojarAPIClient()


class NowPlayingView(RadiojarBaseView):
    """
    Get currently playing track information.
    """
    
    @method_decorator(cache_page(30))  # Cache for 30 seconds
    def get(self, request):
        try:
            data = self.radiojar_client.get_now_playing()
            serializer = NowPlayingSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching now playing: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch current track information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ScheduleView(RadiojarBaseView):
    """
    Get program schedule.
    """
    
    @method_decorator(cache_page(300))  # Cache for 5 minutes
    def get(self, request):
        try:
            date = request.query_params.get('date')
            data = self.radiojar_client.get_schedule(date)
            serializer = ScheduleSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching schedule: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch schedule information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatisticsView(RadiojarBaseView):
    """
    Get real-time listener statistics.
    """
    
    @method_decorator(cache_page(60))  # Cache for 1 minute
    def get(self, request):
        try:
            data = self.radiojar_client.get_statistics()
            serializer = StatisticsSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching statistics: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch statistics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SongHistoryView(RadiojarBaseView):
    """
    Get recently played songs.
    """
    
    @method_decorator(cache_page(120))  # Cache for 2 minutes
    def get(self, request):
        try:
            limit = int(request.query_params.get('limit', 10))
            limit = min(limit, 50)  # Max 50 tracks
            
            data = self.radiojar_client.get_song_history(limit)
            serializer = SongHistorySerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching song history: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch song history'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DJListView(RadiojarBaseView):
    """
    Get DJ/host information.
    """
    
    @method_decorator(cache_page(600))  # Cache for 10 minutes
    def get(self, request):
        try:
            data = self.radiojar_client.get_djs()
            serializer = DJListSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching DJs: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch DJ information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShowListView(RadiojarBaseView):
    """
    Get show/program information.
    """
    
    @method_decorator(cache_page(600))  # Cache for 10 minutes
    def get(self, request):
        try:
            data = self.radiojar_client.get_shows()
            serializer = ShowListSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching shows: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch show information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SongRequestView(RadiojarBaseView):
    """
    Submit song requests.
    """
    permission_classes = [permissions.AllowAny]  # Allow anonymous requests
    
    def post(self, request):
        try:
            serializer = SongRequestSerializer(data=request.data)
            if serializer.is_valid():
                data = self.radiojar_client.submit_song_request(**serializer.validated_data)
                response_serializer = SongRequestResponseSerializer(data)
                return Response(response_serializer.data)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error submitting song request: {e}")
            return Response({
                'success': False,
                'error': 'Failed to submit song request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StationInfoView(RadiojarBaseView):
    """
    Get basic station information.
    """
    
    @method_decorator(cache_page(3600))  # Cache for 1 hour
    def get(self, request):
        try:
            data = self.radiojar_client.get_station_info()
            serializer = StationInfoSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching station info: {e}")
            return Response({
                'success': False,
                'error': 'Failed to fetch station information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Health check endpoint
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """
    Health check endpoint for monitoring.
    """
    return Response({
        'status': 'healthy',
        'service': 'Bellefu Radio API',
        'version': '1.0.0'
    })


# API documentation endpoint
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_info(request):
    """
    API information and available endpoints.
    """
    return Response({
        'service': 'Bellefu Radio API',
        'version': '1.0.0',
        'description': 'Django backend API for Bellefu Radio React Native app',
        'endpoints': {
            'authentication': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'profile': '/api/auth/profile/',
            },
            'radiojar': {
                'now_playing': '/api/radiojar/now-playing/',
                'schedule': '/api/radiojar/schedule/',
                'statistics': '/api/radiojar/statistics/',
                'song_history': '/api/radiojar/song-history/',
                'djs': '/api/radiojar/djs/',
                'shows': '/api/radiojar/shows/',
                'song_request': '/api/radiojar/song-request/',
                'station_info': '/api/radiojar/station-info/',
            },
            'utility': {
                'health': '/api/health/',
                'info': '/api/info/',
            }
        },
        'authentication': 'JWT Bearer Token',
        'documentation': 'https://github.com/your-repo/bellefu-radio'
    })