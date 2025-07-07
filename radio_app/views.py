from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q, Count
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

from .models import (
    Category, RadioStation, UserProfile, Event, 
    BlogPost, ListeningHistory, Contact
)
from .serializers import (
    CategorySerializer, RadioStationSerializer, UserProfileSerializer,
    EventSerializer, BlogPostSerializer, ListeningHistorySerializer,
    ContactSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class RadioStationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RadioStation.objects.filter(is_active=True)
    serializer_class = RadioStationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'country', 'language', 'quality']
    search_fields = ['name', 'description', 'country', 'language']
    ordering_fields = ['name', 'listeners_count', 'created_at']
    ordering = ['-listeners_count']

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular stations"""
        popular_stations = self.queryset.order_by('-listeners_count')[:10]
        serializer = self.get_serializer(popular_stations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured stations (top 5 by listeners)"""
        featured_stations = self.queryset.order_by('-listeners_count')[:5]
        serializer = self.get_serializer(featured_stations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        """Toggle station as favorite for authenticated user"""
        station = self.get_object()
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if station in user_profile.favorite_stations.all():
            user_profile.favorite_stations.remove(station)
            is_favorited = False
            message = "Station removed from favorites"
        else:
            user_profile.favorite_stations.add(station)
            is_favorited = True
            message = "Station added to favorites"
        
        return Response({
            'is_favorited': is_favorited,
            'message': message
        })

    @action(detail=True, methods=['post'])
    def increment_listeners(self, request, pk=None):
        """Increment listener count when someone starts listening"""
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
        """Decrement listener count when someone stops listening"""
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

    @action(detail=False, methods=['get'])
    def favorites(self, request):
        """Get user's favorite stations"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        stations = profile.favorite_stations.filter(is_active=True)
        serializer = RadioStationSerializer(stations, many=True, context={'request': request})
        return Response(serializer.data)


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['station', 'event_type', 'is_featured']
    search_fields = ['title', 'description', 'host']
    ordering_fields = ['start_time', 'created_at']
    ordering = ['start_time']

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        now = timezone.now()
        upcoming_events = self.queryset.filter(start_time__gt=now)[:10]
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def live(self, request):
        """Get currently live events"""
        now = timezone.now()
        live_events = self.queryset.filter(
            start_time__lte=now,
            end_time__gte=now
        )
        serializer = self.get_serializer(live_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured events"""
        featured_events = self.queryset.filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured_events, many=True)
        return Response(serializer.data)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status='published')
    serializer_class = BlogPostSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'tags']
    ordering_fields = ['created_at', 'published_at']
    ordering = ['-published_at']
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        featured_posts = self.queryset.filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent blog posts"""
        recent_posts = self.queryset.order_by('-published_at')[:10]
        serializer = self.get_serializer(recent_posts, many=True)
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
        
        # Most listened stations
        most_listened = history.values('station__name').annotate(
            count=Count('station'),
            total_minutes=models.Sum('duration_minutes')
        ).order_by('-total_minutes')[:5]
        
        return Response({
            'total_sessions': total_sessions,
            'total_minutes': total_minutes,
            'total_hours': round(total_minutes / 60, 1),
            'most_listened_stations': most_listened
        })


class ContactViewSet(viewsets.CreateOnlyModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'message': 'Thank you for your message. We will get back to you soon!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


# Template Views
def home(request):
    """Home page with featured content"""
    # Get featured stations (top 5 by listeners)
    featured_stations = RadioStation.objects.filter(is_active=True).order_by('-listeners_count')[:5]
    
    # Add is_favorited field for authenticated users
    if request.user.is_authenticated:
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        favorite_ids = user_profile.favorite_stations.values_list('id', flat=True)
        for station in featured_stations:
            station.is_favorited = station.id in favorite_ids
    else:
        for station in featured_stations:
            station.is_favorited = False
    
    # Get live events
    now = timezone.now()
    live_events = Event.objects.filter(
        start_time__lte=now,
        end_time__gte=now
    )[:5]
    
    # Get recent blog posts
    recent_posts = BlogPost.objects.filter(status='published').order_by('-published_at')[:3]
    
    # Get platform statistics
    stats = {
        'total_stations': RadioStation.objects.filter(is_active=True).count(),
        'total_listeners': sum(station.listeners_count for station in RadioStation.objects.filter(is_active=True)),
        'live_events': live_events.count(),
        'countries_count': RadioStation.objects.filter(is_active=True).values('country').distinct().count(),
    }
    
    context = {
        'featured_stations': featured_stations,
        'live_events': live_events,
        'recent_posts': recent_posts,
        'stats': stats,
    }
    return render(request, 'home.html', context)


def stations_view(request):
    """Stations listing with search and filters"""
    stations = RadioStation.objects.filter(is_active=True)
    categories = Category.objects.all()
    countries = RadioStation.objects.filter(is_active=True).values_list('country', flat=True).distinct().order_by('country')
    
    # Search
    search = request.GET.get('search')
    if search:
        stations = stations.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(country__icontains=search) |
            Q(language__icontains=search)
        )
    
    # Filters
    category = request.GET.get('category')
    if category:
        stations = stations.filter(category_id=category)
    
    country = request.GET.get('country')
    if country:
        stations = stations.filter(country=country)
    
    quality = request.GET.get('quality')
    if quality:
        stations = stations.filter(quality=quality)
    
    # Order by listeners count
    stations = stations.order_by('-listeners_count')
    
    # Add is_favorited field for authenticated users
    if request.user.is_authenticated:
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        favorite_ids = user_profile.favorite_stations.values_list('id', flat=True)
        for station in stations:
            station.is_favorited = station.id in favorite_ids
    else:
        for station in stations:
            station.is_favorited = False
    
    # Pagination
    paginator = Paginator(stations, 20)
    page_number = request.GET.get('page')
    stations = paginator.get_page(page_number)
    
    context = {
        'stations': stations,
        'categories': categories,
        'countries': countries,
    }
    return render(request, 'stations.html', context)


def events_view(request):
    """Events listing with live and upcoming events"""
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


def blog_view(request):
    """Blog listing with search"""
    posts = BlogPost.objects.filter(status='published')
    featured_posts = posts.filter(is_featured=True)[:3] if not request.GET.get('search') else []
    
    # Search
    search = request.GET.get('search')
    if search:
        posts = posts.filter(
            Q(title__icontains=search) |
            Q(content__icontains=search) |
            Q(excerpt__icontains=search) |
            Q(tags__icontains=search)
        )
    
    posts = posts.order_by('-published_at')
    
    # Pagination
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    posts = paginator.get_page(page_number)
    
    context = {
        'posts': posts,
        'featured_posts': featured_posts,
    }
    return render(request, 'blog.html', context)


def blog_detail(request, slug):
    """Blog post detail"""
    post = get_object_or_404(BlogPost, slug=slug, status='published')
    
    # Get related posts (same tags)
    related_posts = []
    if post.tags:
        tags = [tag.strip() for tag in post.tags.split(',')]
        related_posts = BlogPost.objects.filter(
            status='published',
            tags__iregex=r'(' + '|'.join(tags) + ')'
        ).exclude(id=post.id)[:3]
    
    context = {
        'post': post,
        'related_posts': related_posts,
    }
    return render(request, 'blog_detail.html', context)


@login_required
def dashboard(request):
    """User dashboard"""
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    # Get favorite stations
    favorite_stations = user_profile.favorite_stations.filter(is_active=True)
    
    # Get listening history
    listening_history = ListeningHistory.objects.filter(user=request.user).order_by('-started_at')[:10]
    
    # Get listening statistics
    total_sessions = ListeningHistory.objects.filter(user=request.user).count()
    total_minutes = sum(h.duration_minutes for h in ListeningHistory.objects.filter(user=request.user))
    
    most_listened = ListeningHistory.objects.filter(user=request.user).values('station__name').annotate(
        count=Count('station'),
        total_minutes=models.Sum('duration_minutes')
    ).order_by('-total_minutes')[:5]
    
    listening_stats = {
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'total_hours': round(total_minutes / 60, 1) if total_minutes else 0,
        'most_listened_stations': most_listened,
    }
    
    context = {
        'profile': user_profile,
        'favorite_stations': favorite_stations,
        'listening_history': listening_history,
        'listening_stats': listening_stats,
    }
    return render(request, 'dashboard.html', context)


@login_required
def listening_history_view(request):
    """Full listening history"""
    history = ListeningHistory.objects.filter(user=request.user).order_by('-started_at')
    
    # Statistics
    total_sessions = history.count()
    total_minutes = sum(h.duration_minutes for h in history)
    
    most_listened = history.values('station__name').annotate(
        count=Count('station'),
        total_minutes=models.Sum('duration_minutes')
    ).order_by('-total_minutes')[:10]
    
    stats = {
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'total_hours': round(total_minutes / 60, 1) if total_minutes else 0,
        'most_listened_stations': most_listened,
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
    """User registration"""
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
    """Update user profile"""
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
@login_required
def record_listening_session(request):
    """Record a listening session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            station_id = data.get('station_id')
            duration_minutes = data.get('duration_minutes', 0)
            
            if station_id:
                station = get_object_or_404(RadioStation, id=station_id)
                ListeningHistory.objects.create(
                    user=request.user,
                    station=station,
                    duration_minutes=duration_minutes
                )
                return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})