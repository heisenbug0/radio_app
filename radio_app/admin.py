from django.contrib import admin
from django.utils.html import format_html
from .models import RadioStation, UserProfile


@admin.register(RadioStation)
class RadioStationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'country', 'language', 'quality', 
        'is_active', 'created_at'
    ]
    list_filter = ['country', 'language', 'quality', 'is_active']
    search_fields = ['name', 'description', 'country', 'language']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_active']

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


# Customize admin site
admin.site.site_header = "🎵 Bellefu Radio Admin"
admin.site.site_title = "Bellefu Radio Admin"
admin.site.index_title = "Welcome to Bellefu Radio Administration"