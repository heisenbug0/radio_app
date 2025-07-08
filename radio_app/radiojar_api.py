import requests
from django.conf import settings
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class RadiojarAPIClient:
    """
    Client for interacting with Radiojar API endpoints.
    This acts as a proxy between your Django backend and Radiojar's services.
    """
    
    def __init__(self, stream_name: str = "v994btp2gd0uv"):
        self.stream_name = stream_name
        self.base_url = "https://www.radiojar.com/api"
        self.timeout = 10
        
    def _make_request(self, endpoint: str, params: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """
        Make a request to Radiojar API with error handling.
        """
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Radiojar API request failed: {e}")
            return None
        except ValueError as e:
            logger.error(f"Failed to parse Radiojar API response: {e}")
            return None
    
    def get_now_playing(self) -> Optional[Dict[str, Any]]:
        """
        Get currently playing track information.
        """
        endpoint = f"stations/{self.stream_name}/now-playing"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'title': data.get('title', ''),
                'artist': data.get('artist', ''),
                'album': data.get('album', ''),
                'artwork': data.get('artwork', ''),
                'duration': data.get('duration', 0),
                'started_at': data.get('started_at', ''),
                'stream_name': self.stream_name
            }
        
        return {
            'title': 'Bellefu Radio',
            'artist': 'Live Broadcasting',
            'album': 'Agricultural Programming',
            'artwork': '',
            'duration': 0,
            'started_at': '',
            'stream_name': self.stream_name
        }
    
    def get_schedule(self, date: str = None) -> Optional[Dict[str, Any]]:
        """
        Get program schedule for a specific date or current week.
        """
        endpoint = f"stations/{self.stream_name}/schedule"
        params = {}
        if date:
            params['date'] = date
            
        data = self._make_request(endpoint, params)
        
        if data:
            return {
                'schedule': data.get('schedule', []),
                'current_show': data.get('current_show', None),
                'next_show': data.get('next_show', None),
                'stream_name': self.stream_name
            }
        
        return {
            'schedule': [],
            'current_show': None,
            'next_show': None,
            'stream_name': self.stream_name
        }
    
    def get_statistics(self) -> Optional[Dict[str, Any]]:
        """
        Get real-time listener statistics.
        """
        endpoint = f"stations/{self.stream_name}/stats"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'current_listeners': data.get('current_listeners', 0),
                'peak_listeners': data.get('peak_listeners', 0),
                'total_listeners_today': data.get('total_listeners_today', 0),
                'listening_time_avg': data.get('listening_time_avg', 0),
                'top_countries': data.get('top_countries', []),
                'stream_name': self.stream_name
            }
        
        return {
            'current_listeners': 0,
            'peak_listeners': 0,
            'total_listeners_today': 0,
            'listening_time_avg': 0,
            'top_countries': [],
            'stream_name': self.stream_name
        }
    
    def get_song_history(self, limit: int = 10) -> Optional[Dict[str, Any]]:
        """
        Get recently played songs history.
        """
        endpoint = f"stations/{self.stream_name}/history"
        params = {'limit': limit}
        data = self._make_request(endpoint, params)
        
        if data:
            return {
                'tracks': data.get('tracks', []),
                'total_count': data.get('total_count', 0),
                'stream_name': self.stream_name
            }
        
        return {
            'tracks': [],
            'total_count': 0,
            'stream_name': self.stream_name
        }
    
    def get_djs(self) -> Optional[Dict[str, Any]]:
        """
        Get DJ/host information.
        """
        endpoint = f"stations/{self.stream_name}/djs"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'djs': data.get('djs', []),
                'total_count': data.get('total_count', 0),
                'stream_name': self.stream_name
            }
        
        return {
            'djs': [],
            'total_count': 0,
            'stream_name': self.stream_name
        }
    
    def get_shows(self) -> Optional[Dict[str, Any]]:
        """
        Get show/program information.
        """
        endpoint = f"stations/{self.stream_name}/shows"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'shows': data.get('shows', []),
                'featured_shows': data.get('featured_shows', []),
                'total_count': data.get('total_count', 0),
                'stream_name': self.stream_name
            }
        
        return {
            'shows': [],
            'featured_shows': [],
            'total_count': 0,
            'stream_name': self.stream_name
        }
    
    def submit_song_request(self, song_title: str, artist: str = "", message: str = "", listener_name: str = "") -> bool:
        """
        Submit a song request (if supported by Radiojar).
        """
        endpoint = f"stations/{self.stream_name}/requests"
        data = {
            'song_title': song_title,
            'artist': artist,
            'message': message,
            'listener_name': listener_name
        }
        
        try:
            response = requests.post(f"{self.base_url}/{endpoint}", json=data, timeout=self.timeout)
            return response.status_code == 200
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to submit song request: {e}")
            return False