from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.contrib.auth import views as auth_views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'stations', views.RadioStationViewSet)
router.register(r'profile', views.UserProfileViewSet, basename='userprofile')
router.register(r'events', views.EventViewSet)
router.register(r'blog', views.BlogPostViewSet)
router.register(r'history', views.ListeningHistoryViewSet, basename='listeninghistory')
router.register(r'contact', views.ContactViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    
    # Template views
    path('', views.home, name='home'),
    path('stations/', views.stations_view, name='stations'),
    path('events/', views.events_view, name='events'),
    path('blog/', views.blog_view, name='blog'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('history/', views.listening_history_view, name='listening_history'),
    
    # Authentication
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('register/', views.register_view, name='register'),
    path('update-profile/', views.update_profile, name='update_profile'),
    
    # AJAX endpoints
    path('record-session/', views.record_listening_session, name='record_session'),
]