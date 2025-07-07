from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category, RadioStation, UserProfile, Event, 
    BlogPost, ListeningHistory, Contact
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'icon', 'stations_count', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']

    def stations_count(self, obj):
        return obj.stations.filter(is_active=True).count()
    stations_count.short_description = 'Active Stations'


@admin.register(RadioStation)
class RadioStationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'country', 'language', 'quality', 
        'listeners_count', 'is_active', 'created_at'
    ]
    list_filter = ['category', 'country', 'language', 'quality', 'is_active']
    search_fields = ['name', 'description', 'country', 'language']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_active', 'listeners_count']

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="50" height="50" />', obj.logo.url)
        return "No Logo"
    logo_preview.short_description = 'Logo Preview'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'location', 'favorites_count', 'created_at']
    search_fields = ['user__username', 'user__email', 'location']
    readonly_fields = ['created_at']
    filter_horizontal = ['favorite_stations']

    def favorites_count(self, obj):
        return obj.favorite_stations.count()
    favorites_count.short_description = 'Favorite Stations'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'station', 'event_type', 'start_time', 
        'end_time', 'host', 'is_featured', 'status'
    ]
    list_filter = ['event_type', 'is_featured', 'station', 'start_time']
    search_fields = ['title', 'description', 'host']
    readonly_fields = ['created_at']
    list_editable = ['is_featured']

    def status(self, obj):
        if obj.is_live:
            return format_html('<span style="color: red;">🔴 LIVE</span>')
        elif obj.is_upcoming:
            return format_html('<span style="color: orange;">📅 Upcoming</span>')
        else:
            return format_html('<span style="color: gray;">📝 Past</span>')
    status.short_description = 'Status'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'author', 'status', 'is_featured', 
        'published_at', 'created_at'
    ]
    list_filter = ['status', 'is_featured', 'author', 'created_at']
    search_fields = ['title', 'content', 'tags']
    readonly_fields = ['created_at', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'is_featured']


@admin.register(ListeningHistory)
class ListeningHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'station', 'started_at', 'duration_minutes']
    list_filter = ['station', 'started_at']
    search_fields = ['user__username', 'station__name']
    readonly_fields = ['started_at']


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_resolved', 'created_at']
    list_filter = ['subject', 'is_resolved', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']
    list_editable = ['is_resolved']

# Customize admin site
admin.site.site_header = "🎵 Farmer's Radio Admin"
admin.site.site_title = "Radio Admin"
admin.site.index_title = "Welcome to Farmer's Radio Administration"