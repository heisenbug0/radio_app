import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import Event, RadioStation


class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'events'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send initial event data
        events = await self.get_live_events()
        await self.send(text_data=json.dumps({
            'type': 'initial_events',
            'events': events
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Handle incoming WebSocket messages if needed
        pass

    # Receive message from room group
    async def event_update(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'event_update',
            'event': event['event']
        }))

    async def events_refresh(self, event):
        # Send all live events
        events = await self.get_live_events()
        await self.send(text_data=json.dumps({
            'type': 'events_refresh',
            'events': events
        }))

    @database_sync_to_async
    def get_live_events(self):
        now = timezone.now()
        live_events = Event.objects.filter(
            start_time__lte=now,
            end_time__gte=now
        ).select_related('station')
        
        events_data = []
        for event in live_events:
            events_data.append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'station_name': event.station.name,
                'station_id': event.station.id,
                'event_type': event.get_event_type_display(),
                'start_time': event.start_time.strftime('%H:%M'),
                'end_time': event.end_time.strftime('%H:%M'),
                'host': event.host or 'N/A',
                'is_live': True,
                'is_featured': event.is_featured,
            })
        
        return events_data


class StationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'stations'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Handle incoming WebSocket messages if needed
        pass

    # Receive message from room group
    async def listener_update(self, event):
        # Send listener count update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'listener_update',
            'station_id': event['station_id'],
            'listeners_count': event['listeners_count']
        }))