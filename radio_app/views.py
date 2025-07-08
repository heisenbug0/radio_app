from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import RadioStation, UserProfile, Event, ListeningHistory
from .serializers import (
    RadioStationSerializer, UserProfileSerializer,
    EventSerializer, ListeningHistorySerializer
)


class RadioStationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RadioStationSerializer
    
    def get_queryset(self):
        # Always return the single Bellefu Radio station
        return RadioStation.objects.filter(is_active=True)

    @action(detail=True, methods=['post'])
    def increment_listeners(self, request, pk=None):
        """Increment listener count when someone starts listening - NO AUTH REQUIRED"""
        station = self.get_object()
        station.listeners_count += 1
        station.save()
        
        # Send real-time update via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'stations',
            {
                'type': 'listener_update',
                'station_id': station.id,
                'listeners_count': station.listeners_count
            }
        )
        
        return Response({'listeners_count': station.listeners_count})

    @action(detail=True, methods=['post'])
    def decrement_listeners(self, request, pk=None):
        """Decrement listener count when someone stops listening - NO AUTH REQUIRED"""
        station = self.get_object()
        if station.listeners_count > 0:
            station.listeners_count -= 1
            station.save()
            
        # Send real-time update via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'stations',
            {
                'type': 'listener_update',
                'station_id': station.id,
                'listeners_count': station.listeners_count
            }
        )
        
        return Response({'listeners_count': station.listeners_count})


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """Events/Programs are public - NO AUTH REQUIRED"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['station', 'event_type', 'is_featured']
    search_fields = ['title', 'description', 'host']
    ordering_fields = ['start_time', 'created_at']
    ordering = ['start_time']

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events - PUBLIC"""
        now = timezone.now()
        upcoming_events = self.queryset.filter(start_time__gt=now)[:10]
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def live(self, request):
        """Get currently live events - PUBLIC"""
        now = timezone.now()
        live_events = self.queryset.filter(
            start_time__lte=now,
            end_time__gte=now
        )
        serializer = self.get_serializer(live_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured events - PUBLIC"""
        featured_events = self.queryset.filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured_events, many=True)
        return Response(serializer.data)


class ListeningHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = ListeningHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ListeningHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get listening statistics for the user"""
        history = self.get_queryset()
        total_sessions = history.count()
        total_minutes = sum(h.duration_minutes for h in history)
        
        return Response({
            'total_sessions': total_sessions,
            'total_minutes': total_minutes,
            'total_hours': round(total_minutes / 60, 1),
        })


# Template Views - Most are now PUBLIC
def home(request):
    """Home page - PUBLIC, no authentication required"""
    # Get the single Bellefu Radio station (handle multiple or none)
    bellefu_station = RadioStation.objects.filter(is_active=True).first()
    
    # Get live events
    now = timezone.now()
    live_events = Event.objects.filter(
        start_time__lte=now,
        end_time__gte=now
    )[:5]
    
    # Get upcoming events
    upcoming_events = Event.objects.filter(
        start_time__gt=now
    ).order_by('start_time')[:3]
    
    # Get platform statistics
    stats = {
        'total_listeners': bellefu_station.listeners_count if bellefu_station else 0,
        'live_events': live_events.count(),
        'upcoming_events': upcoming_events.count(),
    }
    
    context = {
        'bellefu_station': bellefu_station,
        'live_events': live_events,
        'upcoming_events': upcoming_events,
        'stats': stats,
    }
    return render(request, 'home.html', context)


def events_view(request):
    """Events listing - PUBLIC, no authentication required"""
    now = timezone.now()
    
    # Live events
    live_events = Event.objects.filter(
        start_time__lte=now,
        end_time__gte=now
    ).order_by('start_time')
    
    # Upcoming events
    upcoming_events = Event.objects.filter(
        start_time__gt=now
    ).order_by('start_time')
    
    # Pagination for upcoming events
    paginator = Paginator(upcoming_events, 20)
    page_number = request.GET.get('page')
    upcoming_events = paginator.get_page(page_number)
    
    context = {
        'live_events': live_events,
        'upcoming_events': upcoming_events,
    }
    return render(request, 'events.html', context)


@login_required
def dashboard(request):
    """User dashboard - REQUIRES AUTHENTICATION"""
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    # Get listening history
    listening_history = ListeningHistory.objects.filter(user=request.user).order_by('-started_at')[:10]
    
    # Get listening statistics
    total_sessions = ListeningHistory.objects.filter(user=request.user).count()
    total_minutes = sum(h.duration_minutes for h in ListeningHistory.objects.filter(user=request.user))
    
    listening_stats = {
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'total_hours': round(total_minutes / 60, 1) if total_minutes else 0,
    }
    
    context = {
        'profile': user_profile,
        'listening_history': listening_history,
        'listening_stats': listening_stats,
    }
    return render(request, 'dashboard.html', context)


@login_required
def listening_history_view(request):
    """Full listening history - REQUIRES AUTHENTICATION"""
    history = ListeningHistory.objects.filter(user=request.user).order_by('-started_at')
    
    # Statistics
    total_sessions = history.count()
    total_minutes = sum(h.duration_minutes for h in history)
    
    stats = {
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'total_hours': round(total_minutes / 60, 1) if total_minutes else 0,
    }
    
    # Pagination
    paginator = Paginator(history, 50)
    page_number = request.GET.get('page')
    history = paginator.get_page(page_number)
    
    context = {
        'history': history,
        'stats': stats,
    }
    return render(request, 'listening_history.html', context)


def register_view(request):
    """User registration - OPTIONAL"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Set additional fields if provided
            user.email = request.POST.get('email', '')
            user.first_name = request.POST.get('first_name', '')
            user.last_name = request.POST.get('last_name', '')
            user.save()
            
            # Create user profile
            UserProfile.objects.create(user=user)
            
            # Log the user in
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            
            messages.success(request, f'Account created successfully! Welcome, {username}!')
            return redirect('dashboard')
    else:
        form = UserCreationForm()
    
    return render(request, 'auth/register.html', {'form': form})


@login_required
def update_profile(request):
    """Update user profile - REQUIRES AUTHENTICATION"""
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.save()
        
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.location = request.POST.get('location', '')
        profile.bio = request.POST.get('bio', '')
        profile.save()
        
        messages.success(request, 'Profile updated successfully!')
    
    return redirect('dashboard')


@csrf_exempt
def record_listening_session(request):
    """Record a listening session - OPTIONAL (only if user is logged in)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            station_id = data.get('station_id')
            duration_minutes = data.get('duration_minutes', 0)
            
            # Only record if user is authenticated
            if request.user.is_authenticated and station_id:
                station = get_object_or_404(RadioStation, id=station_id)
                ListeningHistory.objects.create(
                    user=request.user,
                    station=station,
                    duration_minutes=duration_minutes
                )
                return JsonResponse({'status': 'success', 'recorded': True})
            else:
                # User not logged in, but that's OK - just don't record
                return JsonResponse({'status': 'success', 'recorded': False, 'message': 'Not logged in'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})