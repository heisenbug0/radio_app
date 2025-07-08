# Bellefu Radio API Documentation

## Overview

This document describes the REST API endpoints available for the Bellefu Radio React Native mobile application. The API serves as a proxy between the mobile app and Radiojar's services, providing authentication, user management, and real-time radio data.

## Base URL

```
Production: https://your-app-name.onrender.com
Development: http://localhost:8000
```

## Authentication

The API uses JWT (JSON Web Token) authentication for protected endpoints.

### Headers

For authenticated requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register/
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string (optional)",
  "first_name": "string (optional)",
  "last_name": "string (optional)",
  "password": "string",
  "password_confirm": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_joined": "2024-01-01T00:00:00Z",
    "profile": {
      "user": "john_doe",
      "avatar": null,
      "bio": "",
      "location": "",
      "created_at": "2024-01-01T00:00:00Z"
    }
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login/
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { /* user object */ },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Get User Profile
```http
GET /api/auth/profile/
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_joined": "2024-01-01T00:00:00Z",
    "profile": {
      "user": "john_doe",
      "avatar": null,
      "bio": "Agricultural enthusiast",
      "location": "Lagos, Nigeria",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Update User Profile
```http
PUT /api/auth/profile/
```
*Requires authentication*

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### Radiojar API Proxy

All Radiojar endpoints are public and don't require authentication.

#### Get Now Playing
```http
GET /api/radiojar/now-playing/
```

**Response:**
```json
{
  "success": true,
  "title": "Morning Farm Report",
  "artist": "DJ Agricultural",
  "album": "Live Programming",
  "artwork": "https://example.com/artwork.jpg",
  "duration": 3600,
  "started_at": "2024-01-01T06:00:00Z",
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Get Program Schedule
```http
GET /api/radiojar/schedule/
```

**Query Parameters:**
- `date` (optional): Specific date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "schedule": [
    {
      "show_id": "morning_farm",
      "show_title": "Morning Farm Report",
      "show_description": "Daily agricultural news and weather",
      "start_time": "2024-01-01T06:00:00Z",
      "end_time": "2024-01-01T08:00:00Z",
      "host_name": "DJ Agricultural",
      "is_live": true
    }
  ],
  "current_show": { /* current show object */ },
  "next_show": { /* next show object */ },
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Get Statistics
```http
GET /api/radiojar/statistics/
```

**Response:**
```json
{
  "success": true,
  "current_listeners": 150,
  "peak_listeners": 300,
  "total_listeners_today": 1200,
  "listening_time_avg": 45.5,
  "top_countries": [
    {"country": "Nigeria", "listeners": 80},
    {"country": "Ghana", "listeners": 25}
  ],
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Get Song History
```http
GET /api/radiojar/song-history/
```

**Query Parameters:**
- `limit` (optional): Number of tracks to return (max 50, default 10)

**Response:**
```json
{
  "success": true,
  "tracks": [
    {
      "title": "Farm Weather Update",
      "artist": "Weather Team",
      "album": "Daily Updates",
      "played_at": "2024-01-01T06:00:00Z",
      "duration": 300,
      "artwork": "https://example.com/weather.jpg"
    }
  ],
  "total_count": 25,
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Get DJs/Hosts
```http
GET /api/radiojar/djs/
```

**Response:**
```json
{
  "success": true,
  "djs": [
    {
      "id": "dj_agricultural",
      "name": "John Agricultural",
      "nickname": "DJ Agricultural",
      "bio": "Expert in agricultural broadcasting",
      "photo": "https://example.com/dj.jpg",
      "social_links": {
        "twitter": "@djagricultural",
        "facebook": "djagricultural"
      }
    }
  ],
  "total_count": 5,
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Get Shows
```http
GET /api/radiojar/shows/
```

**Response:**
```json
{
  "success": true,
  "shows": [
    {
      "id": "morning_farm",
      "title": "Morning Farm Report",
      "description": "Daily agricultural news and weather updates",
      "host_name": "DJ Agricultural",
      "schedule": "Monday-Friday 6:00-8:00 AM",
      "image": "https://example.com/show.jpg",
      "is_featured": true
    }
  ],
  "featured_shows": [ /* featured shows array */ ],
  "total_count": 8,
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Submit Song Request
```http
POST /api/radiojar/song-request/
```

**Request Body:**
```json
{
  "song_title": "Country Roads",
  "artist": "John Denver",
  "message": "Great song for farmers!",
  "listener_name": "John Farmer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Song request submitted successfully",
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

#### Get Station Info
```http
GET /api/radiojar/station-info/
```

**Response:**
```json
{
  "success": true,
  "station_name": "Bellefu Radio",
  "description": "Your premier agricultural radio station",
  "website": "https://bellefuradio.com",
  "logo": "https://example.com/logo.jpg",
  "stream_url": "https://stream.radiojar.com/v994btp2gd0uv",
  "stream_name": "v994btp2gd0uv",
  "timestamp": "2024-01-01T06:30:00Z"
}
```

### Utility Endpoints

#### Health Check
```http
GET /api/health/
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Bellefu Radio API",
  "version": "1.0.0"
}
```

#### API Information
```http
GET /api/info/
```

**Response:**
```json
{
  "service": "Bellefu Radio API",
  "version": "1.0.0",
  "description": "Django backend API for Bellefu Radio React Native app",
  "endpoints": { /* endpoint documentation */ },
  "authentication": "JWT Bearer Token",
  "documentation": "https://github.com/your-repo/bellefu-radio"
}
```

## WebSocket Connections

For real-time updates, the API supports WebSocket connections:

### Radio Data WebSocket
```
ws://localhost:8000/ws/radio/v994btp2gd0uv/
```

**Message Types:**
- `get_now_playing`: Request current track info
- `get_statistics`: Request listener statistics
- `get_schedule`: Request program schedule

**Automatic Updates:**
- Now playing updates every 30 seconds
- Statistics updates every 60 seconds

### Events WebSocket
```
ws://localhost:8000/ws/events/
```

For general notifications and events.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "errors": {
    "field_name": ["Field-specific error messages"]
  }
}
```

## Rate Limiting

API responses are cached to improve performance:
- Now playing: 30 seconds
- Schedule: 5 minutes
- Statistics: 1 minute
- Song history: 2 minutes
- DJs/Shows: 10 minutes
- Station info: 1 hour

## CORS Configuration

The API is configured to accept requests from:
- React Native Metro bundler (localhost:8081)
- Development servers (localhost:3000)
- Production domains (configured via environment variables)

## Environment Variables

Required environment variables:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DATABASE_URL`: PostgreSQL connection string (optional)
- `REDIS_URL`: Redis connection string (optional)
- `RADIOJAR_STREAM_NAME`: Radiojar stream identifier
- `RADIOJAR_API_TIMEOUT`: API timeout in seconds

## React Native Integration

### Installation

```bash
npm install axios react-native-async-storage
```

### Example Usage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://your-app-name.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
const login = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login/', {
      username,
      password,
    });
    
    if (response.data.success) {
      await AsyncStorage.setItem('access_token', response.data.tokens.access);
      await AsyncStorage.setItem('refresh_token', response.data.tokens.refresh);
      return response.data.user;
    }
  } catch (error) {
    throw error.response.data;
  }
};

// Get now playing
const getNowPlaying = async () => {
  try {
    const response = await api.get('/api/radiojar/now-playing/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```

## Support

For API support and questions:
- Check the health endpoint: `/api/health/`
- Review API info: `/api/info/`
- Monitor logs for error details
- Test endpoints with tools like Postman or curl

## Changelog

### Version 1.0.0
- Initial API release
- JWT authentication
- Radiojar proxy endpoints
- WebSocket support
- User management
- Real-time radio data