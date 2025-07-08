import json
import asyncio
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .radiojar_api import RadiojarAPIClient

logger = logging.getLogger(__name__)


class RadioConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time radio data updates.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stream_name = None
        self.room_group_name = None
        self.radiojar_client = None
        self.update_task = None
    
    async def connect(self):
        self.stream_name = self.scope['url_route']['kwargs']['stream_name']
        self.room_group_name = f'radio_{self.stream_name}'
        self.radiojar_client = RadiojarAPIClient(self.stream_name)
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Start periodic updates
        self.update_task = asyncio.create_task(self.send_periodic_updates())
        
        logger.info(f"WebSocket connected for stream: {self.stream_name}")
    
    async def disconnect(self, close_code):
        # Cancel update task
        if self.update_task:
            self.update_task.cancel()
        
        # Leave room group
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        
        logger.info(f"WebSocket disconnected for stream: {self.stream_name}")
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'get_now_playing':
                await self.send_now_playing()
            elif message_type == 'get_statistics':
                await self.send_statistics()
            elif message_type == 'get_schedule':
                await self.send_schedule()
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Unknown message type'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            logger.error(f"Error in WebSocket receive: {e}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Internal server error'
            }))
    
    async def send_periodic_updates(self):
        """
        Send periodic updates to connected clients.
        """
        while True:
            try:
                # Send now playing every 30 seconds
                await self.send_now_playing()
                await asyncio.sleep(30)
                
                # Send statistics every 60 seconds
                await self.send_statistics()
                await asyncio.sleep(30)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in periodic updates: {e}")
                await asyncio.sleep(60)  # Wait before retrying
    
    async def send_now_playing(self):
        """
        Send current track information.
        """
        try:
            data = await asyncio.get_event_loop().run_in_executor(
                None, self.radiojar_client.get_now_playing
            )
            
            await self.send(text_data=json.dumps({
                'type': 'now_playing',
                'data': data
            }))
            
        except Exception as e:
            logger.error(f"Error sending now playing: {e}")
    
    async def send_statistics(self):
        """
        Send listener statistics.
        """
        try:
            data = await asyncio.get_event_loop().run_in_executor(
                None, self.radiojar_client.get_statistics
            )
            
            await self.send(text_data=json.dumps({
                'type': 'statistics',
                'data': data
            }))
            
        except Exception as e:
            logger.error(f"Error sending statistics: {e}")
    
    async def send_schedule(self):
        """
        Send program schedule.
        """
        try:
            data = await asyncio.get_event_loop().run_in_executor(
                None, self.radiojar_client.get_schedule
            )
            
            await self.send(text_data=json.dumps({
                'type': 'schedule',
                'data': data
            }))
            
        except Exception as e:
            logger.error(f"Error sending schedule: {e}")
    
    # Group message handlers
    async def radio_update(self, event):
        """
        Handle radio update messages from group.
        """
        await self.send(text_data=json.dumps({
            'type': 'radio_update',
            'data': event['data']
        }))


class EventConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for general events and notifications.
    """
    
    async def connect(self):
        self.room_group_name = 'events'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        logger.info("Event WebSocket connected")
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info("Event WebSocket disconnected")
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            # Handle different event types
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Unknown event type'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            logger.error(f"Error in event WebSocket receive: {e}")
    
    # Group message handlers
    async def event_notification(self, event):
        """
        Handle event notifications from group.
        """
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['data']
        }))