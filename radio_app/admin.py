from django.contrib import admin
from django.utils.html import format_html
from .models import RadioStation, UserProfile, Event, ListeningHistory


@admin.register(RadioStation)
class RadioStationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'country', 'language', 'quality', 
        'listeners_count', 'is_active', 'created_at'
    ]
    list_filter = ['country', 'language', 'quality', 'is_active']
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
    list_display = ['user', 'location', 'created_at']
    search_fields = ['user__username', 'user__email', 'location']
    readonly_fields = ['created_at']


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


@admin.register(ListeningHistory)
class ListeningHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'station', 'started_at', 'duration_minutes']
    list_filter = ['station', 'started_at']
    search_fields = ['user__username', 'station__name']
    readonly_fields = ['started_at']


# Customize admin site
admin.site.site_header = "🎵 Bellefu Radio Admin"
admin.site.site_title = "Bellefu Radio Admin"
admin.site.index_title = "Welcome to Bellefu Radio Administration"