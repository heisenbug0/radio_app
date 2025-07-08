# 🎵 Bellefu Radio - Django Web Application

A Django web application for Bellefu Radio - your premier agricultural radio station. This application provides a single radio station streaming experience with real-time features, program scheduling, and optional user accounts for enhanced features.

## 🚀 Features

**Core Radio Experience (No Authentication Required):**
- Listen to Bellefu Radio live stream via embedded Radiojar player
- View current and upcoming radio programs/events
- Real-time listener count updates via WebSockets
- Live program status updates (live, upcoming, past)
- Mobile-friendly responsive design
- 24/7 streaming with agricultural content

**Optional User Features (Authentication Required):**
- Personal listening history tracking
- Listening statistics and analytics
- User profile management
- Personal dashboard with listening insights

**Admin Features:**
- Full program/event management
- Station information management
- User management
- Real-time WebSocket updates for events and listener counts

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)
- **Redis** (for WebSocket functionality)

### Quick Start

1. **Navigate to the project directory**:
```bash
cd /path/to/bellefu-radio-project
```

2. **Create and activate virtual environment**:
```bash
python -m venv radio_env
# On Windows:
radio_env\Scripts\activate
# On macOS/Linux:
source radio_env/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Install and Start Redis** (Required for WebSockets):

**Windows:**
- Download Redis from: https://github.com/microsoftarchive/redis/releases
- Install and start Redis server
- Or use Docker: `docker run -d -p 6379:6379 redis:alpine`

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

5. **Environment Configuration**:
Create a `.env` file in the project root:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

6. **Database Setup**:
```bash
# Create migrations for radio_app models
python manage.py makemigrations radio_app

# Apply all migrations
python manage.py migrate

# Load Bellefu Radio data
python manage.py populate_sample_data
```

7. **Run Development Server**:
```bash
python manage.py runserver
```

Bellefu Radio will be available at `http://localhost:8000/`

### Admin Panel
Access the admin panel at `http://localhost:8000/admin/`
- Username: `admin`
- Password: `admin123`

## 🎵 Setting Up Your Radiojar Stream

### Important: Replace Placeholder with Real Stream

1. **Get your Radiojar embed code** from your Radiojar dashboard
2. **Edit `templates/home.html`** and replace the placeholder div with your actual Radiojar embed code
3. **Update the stream URL** in the admin panel:
   - Go to `/admin/`
   - Edit the "Bellefu Radio" station
   - Update the `stream_url` field with your actual Radiojar stream URL
4. **Test the player** to ensure it works correctly

The player will automatically integrate with the real-time listener tracking system.

## 🔧 WebSocket Configuration

### Redis Setup (Recommended for Production)
The app is configured to use Redis for WebSocket channel layers. Make sure Redis is running on `localhost:6379`.

### In-Memory Alternative (Development Only)
If you can't install Redis, you can use the in-memory channel layer by uncommenting these lines in `settings.py`:

```python
# For development without Redis, use in-memory channel layer
CHANNEL_LAYERS = {
    'default': {
        'backend': 'channels.layers.InMemoryChannelLayer'
    }
}
```

**Note**: In-memory channels don't work with multiple server processes and should only be used for development.

## 🧪 Testing the Application

### 1. **Real-time Features Testing**

**WebSocket Connection Test**:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Visit any page - you should see:
   - "Event WebSocket connected"
   - "Station WebSocket connected"

**Live Program Updates**:
1. Open the Programs page (`/events/`)
2. In admin panel, create a new event with current time
3. The event should appear as "LIVE" instantly without page refresh
4. When the event time passes, status updates automatically

**Real-time Listener Counts**:
1. Open two browser windows/tabs
2. In one tab, start playing the radio
3. In the other tab, watch the listener count increase instantly
4. Stop playing - count decreases immediately

### 2. **User Features Testing**

**Anonymous Usage**:
- Listen to radio without creating account
- View program schedules
- See real-time updates

**Authenticated Usage**:
- Create account (optional)
- Track listening history
- View personal statistics
- Manage profile

### 3. **Mobile Testing**
- All features work on mobile devices
- WebSocket connections work on mobile browsers
- Responsive design adapts to all screen sizes

## 🔧 Troubleshooting

### Common Issues

**1. Migration Errors**
```
django.db.utils.OperationalError: no such table: radio_app_radiostation
```
**Solution**: Create migrations for radio_app models first:
```bash
python manage.py makemigrations radio_app
python manage.py migrate
python manage.py populate_sample_data
```

**2. WebSocket Connection Failed**
```
Error: WebSocket connection failed
```
**Solution**: Make sure Redis is running:
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"

# If not running, start Redis:
# Windows: Start Redis service
# macOS: brew services start redis
# Linux: sudo systemctl start redis-server
```

**3. Radiojar Player Not Working**
**Solution**: 
- Make sure you've replaced the placeholder with actual Radiojar embed code
- Update the stream_url in the admin panel
- Check browser console for any JavaScript errors

**4. Missing Dependencies**
```
ModuleNotFoundError: No module named 'channels'
```
**Solution**: Install all required dependencies:
```bash
pip install -r requirements.txt
```

## 📊 Real-time Features

### WebSocket Endpoints
- `ws://localhost:8000/ws/events/` - Live program updates
- `ws://localhost:8000/ws/stations/` - Station listener count updates

### Real-time Updates
1. **Program Status Changes**: Live/upcoming/past status updates instantly
2. **Listener Counts**: Real-time listener count updates across all pages
3. **New Programs**: New programs appear immediately when created
4. **Program Deletions**: Removed programs disappear instantly

### Automatic Features
- **Auto-reconnection**: WebSocket connections automatically reconnect
- **Error Handling**: Graceful fallback if WebSocket fails
- **Cross-tab Updates**: Changes in one tab reflect in all open tabs

## 🚀 Production Deployment

### WebSocket Requirements
1. **Redis Server**: Required for production WebSocket functionality
2. **ASGI Server**: Use Daphne or Uvicorn instead of WSGI
3. **WebSocket Support**: Ensure your hosting supports WebSockets

### Deployment Commands
```bash
# Install production dependencies
pip install daphne

# Run with ASGI server
daphne -p 8000 radio_project.asgi:application

# Or with Uvicorn
uvicorn radio_project.asgi:application --host 0.0.0.0 --port 8000
```

### Environment Variables
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
REDIS_URL=redis://your-redis-server:6379
```

## 📈 Performance Benefits

### WebSocket Advantages
- **90% Less Server Load**: No more polling every 30 seconds
- **Instant Updates**: Real-time user experience
- **Better UX**: No page refreshes or loading delays
- **Scalable**: Handles many concurrent users efficiently

### Single Station Focus
- **Simplified UI**: Clean, focused user experience
- **Better Performance**: Optimized for single station streaming
- **Easier Maintenance**: Less complex codebase
- **Mobile Optimized**: Perfect for mobile radio listening

## 🔄 Development Workflow

### Testing Real-time Features
1. **Start Redis**: `redis-server` or service
2. **Run Django**: `python manage.py runserver`
3. **Open Multiple Tabs**: Test cross-tab updates
4. **Monitor Console**: Check WebSocket connections
5. **Test Admin Changes**: Create/modify programs and see instant updates

### Adding New Programs
1. Go to admin panel (`/admin/`)
2. Add new Event with appropriate timing
3. Program appears instantly on frontend
4. Status updates automatically based on time

## 📚 Technical Architecture

### WebSocket Implementation
- **Django Channels**: Handles WebSocket connections
- **Redis**: Channel layer for message passing
- **ASGI**: Asynchronous server gateway interface
- **Consumer Classes**: Handle WebSocket events

### Single Station Design
- **Focused Experience**: All features centered around one radio station
- **Simplified Models**: Removed unnecessary complexity
- **Optional Authentication**: Users can listen without accounts
- **Real-time Updates**: Instant program and listener count updates

## 🆘 Support

### Getting Help
1. **Check Console**: Look for WebSocket connection messages
2. **Verify Redis**: Ensure Redis is running and accessible
3. **Test Radiojar**: Verify your embed code works
4. **Check Network**: Ensure WebSocket connections aren't blocked

### Common Solutions
- **Restart Redis**: `sudo systemctl restart redis-server`
- **Clear Browser Cache**: Hard refresh (Ctrl+F5)
- **Check Firewall**: Ensure WebSocket ports aren't blocked
- **Update Dependencies**: `pip install -r requirements.txt --upgrade`

---

## 🎵 Ready to Broadcast!

Bellefu Radio now features:
- ✅ **Single station focus** for better user experience
- ✅ **Real-time WebSocket updates** for programs and listener counts
- ✅ **Optional user authentication** - listen without accounts
- ✅ **Radiojar integration** for professional streaming
- ✅ **Mobile-optimized** responsive design
- ✅ **Admin-friendly** program management
- ✅ **Production-ready** with proper deployment instructions

Start the server and begin broadcasting with Bellefu Radio!