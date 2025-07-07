from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Event


@receiver(post_save, sender=Event)
def event_saved(sender, instance, created, **kwargs):
    """Send WebSocket update when an event is saved"""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'events',
        {
            'type': 'events_refresh'
        }
    )


@receiver(post_delete, sender=Event)
def event_deleted(sender, instance, **kwargs):
    """Send WebSocket update when an event is deleted"""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'events',
        {
            'type': 'events_refresh'
        }
    )