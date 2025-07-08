import requests
from django.conf import settings
from typing import Dict, Any, Optional
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class RadiojarAPIClient:
    """
    Enhanced client for interacting with Radiojar API endpoints.
    This acts as a proxy between your Django backend and Radiojar's services.
    """
    
    def __init__(self, stream_name: str = None):
        self.stream_name = stream_name or getattr(settings, 'RADIOJAR_STREAM_NAME', 'v994btp2gd0uv')
        self.base_url = "https://www.radiojar.com/api"
        self.timeout = getattr(settings, 'RADIOJAR_API_TIMEOUT', 10)
        
    def _make_request(self, endpoint: str, params: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """
        Make a request to Radiojar API with error handling.
        """
        try:
            url = f"{self.base_url}/{endpoint}"
            logger.debug(f"Making request to: {url} with params: {params}")
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            logger.debug(f"Received response: {data}")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Radiojar API request failed for {endpoint}: {e}")
            return None
        except ValueError as e:
            logger.error(f"Failed to parse Radiojar API response for {endpoint}: {e}")
            return None
    
    def get_now_playing(self) -> Dict[str, Any]:
        """
        Get currently playing track information.
        """
        endpoint = f"stations/{self.stream_name}/now-playing"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'success': True,
                'title': data.get('title', ''),
                'artist': data.get('artist', ''),
                'album': data.get('album', ''),
                'artwork': data.get('artwork', ''),
                'duration': data.get('duration', 0),
                'started_at': data.get('started_at', ''),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'title': 'Bellefu Radio',
            'artist': 'Live Broadcasting',
            'album': 'Agricultural Programming',
            'artwork': '',
            'duration': 0,
            'started_at': '',
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch current track information'
        }
    
    def get_schedule(self, date: str = None) -> Dict[str, Any]:
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
                'success': True,
                'schedule': data.get('schedule', []),
                'current_show': data.get('current_show', None),
                'next_show': data.get('next_show', None),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'schedule': [],
            'current_show': None,
            'next_show': None,
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch schedule information'
        }
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get real-time listener statistics.
        """
        endpoint = f"stations/{self.stream_name}/stats"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'success': True,
                'current_listeners': data.get('current_listeners', 0),
                'peak_listeners': data.get('peak_listeners', 0),
                'total_listeners_today': data.get('total_listeners_today', 0),
                'listening_time_avg': data.get('listening_time_avg', 0),
                'top_countries': data.get('top_countries', []),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'current_listeners': 0,
            'peak_listeners': 0,
            'total_listeners_today': 0,
            'listening_time_avg': 0,
            'top_countries': [],
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch statistics'
        }
    
    def get_song_history(self, limit: int = 10) -> Dict[str, Any]:
        """
        Get recently played songs history.
        """
        endpoint = f"stations/{self.stream_name}/history"
        params = {'limit': limit}
        data = self._make_request(endpoint, params)
        
        if data:
            return {
                'success': True,
                'tracks': data.get('tracks', []),
                'total_count': data.get('total_count', 0),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'tracks': [],
            'total_count': 0,
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch song history'
        }
    
    def get_djs(self) -> Dict[str, Any]:
        """
        Get DJ/host information.
        """
        endpoint = f"stations/{self.stream_name}/djs"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'success': True,
                'djs': data.get('djs', []),
                'total_count': data.get('total_count', 0),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'djs': [],
            'total_count': 0,
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch DJ information'
        }
    
    def get_shows(self) -> Dict[str, Any]:
        """
        Get show/program information.
        """
        endpoint = f"stations/{self.stream_name}/shows"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'success': True,
                'shows': data.get('shows', []),
                'featured_shows': data.get('featured_shows', []),
                'total_count': data.get('total_count', 0),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'shows': [],
            'featured_shows': [],
            'total_count': 0,
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch show information'
        }
    
    def submit_song_request(self, song_title: str, artist: str = "", message: str = "", listener_name: str = "") -> Dict[str, Any]:
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
            success = response.status_code == 200
            
            return {
                'success': success,
                'message': 'Song request submitted successfully' if success else 'Failed to submit song request',
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to submit song request: {e}")
            return {
                'success': False,
                'message': 'Failed to submit song request',
                'error': str(e),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
    
    def get_station_info(self) -> Dict[str, Any]:
        """
        Get basic station information.
        """
        endpoint = f"stations/{self.stream_name}/info"
        data = self._make_request(endpoint)
        
        if data:
            return {
                'success': True,
                'station_name': data.get('name', 'Bellefu Radio'),
                'description': data.get('description', 'Agricultural Radio Programming'),
                'website': data.get('website', ''),
                'logo': data.get('logo', ''),
                'stream_url': data.get('stream_url', f'https://stream.radiojar.com/{self.stream_name}'),
                'stream_name': self.stream_name,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        
        return {
            'success': False,
            'station_name': 'Bellefu Radio',
            'description': 'Agricultural Radio Programming',
            'website': '',
            'logo': '',
            'stream_url': f'https://stream.radiojar.com/{self.stream_name}',
            'stream_name': self.stream_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'error': 'Unable to fetch station information'
        }