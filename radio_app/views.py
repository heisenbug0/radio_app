from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages

from .models import RadioStation, UserProfile
from .serializers import RadioStationSerializer, UserProfileSerializer


class RadioStationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RadioStationSerializer
    
    def get_queryset(self):
        # Always return the single Bellefu Radio station
        return RadioStation.objects.filter(is_active=True)


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)


# Template Views
def home(request):
    """Home page - PUBLIC, no authentication required"""
    # Get the single Bellefu Radio station
    bellefu_station = RadioStation.objects.filter(is_active=True).first()
    
    context = {
        'bellefu_station': bellefu_station,
    }
    return render(request, 'home.html', context)


@login_required
def dashboard(request):
    """User dashboard - REQUIRES AUTHENTICATION"""
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    context = {
        'profile': user_profile,
    }
    return render(request, 'dashboard.html', context)


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