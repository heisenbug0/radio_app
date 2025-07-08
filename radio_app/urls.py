from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, api_views
from django.contrib.auth import views as auth_views

# DRF Router for ViewSets
router = DefaultRouter()
router.register(r'stations', views.RadioStationViewSet, basename='radiostation')
router.register(r'profile', views.UserProfileViewSet, basename='userprofile')

urlpatterns = [
    # DRF API endpoints
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    
    # JWT Authentication endpoints for React Native
    path('api/auth/register/', api_views.RegisterView.as_view(), name='api_register'),
    path('api/auth/login/', api_views.LoginView.as_view(), name='api_login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='api_token_refresh'),
    path('api/auth/profile/', api_views.UserProfileView.as_view(), name='api_profile'),
    
    # Radiojar API proxy endpoints
    path('api/radiojar/now-playing/', api_views.NowPlayingView.as_view(), name='api_now_playing'),
    path('api/radiojar/schedule/', api_views.ScheduleView.as_view(), name='api_schedule'),
    path('api/radiojar/statistics/', api_views.StatisticsView.as_view(), name='api_statistics'),
    path('api/radiojar/song-history/', api_views.SongHistoryView.as_view(), name='api_song_history'),
    path('api/radiojar/djs/', api_views.DJListView.as_view(), name='api_djs'),
    path('api/radiojar/shows/', api_views.ShowListView.as_view(), name='api_shows'),
    path('api/radiojar/song-request/', api_views.SongRequestView.as_view(), name='api_song_request'),
    path('api/radiojar/station-info/', api_views.StationInfoView.as_view(), name='api_station_info'),
    
    # Utility endpoints
    path('api/health/', api_views.health_check, name='api_health'),
    path('api/info/', api_views.api_info, name='api_info'),
    
    # Web template views (existing)
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # Web authentication (existing)
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('register/', views.register_view, name='register'),
    path('update-profile/', views.update_profile, name='update_profile'),
]