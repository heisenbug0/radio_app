# 🎵 Bellefu Radio - Django Web Application

A Django web application for Bellefu Radio - your premier agricultural radio station. This application provides a single radio station streaming experience with real-time features, program scheduling, and optional user accounts for enhanced features.

## 🚀 Features

**Core Radio Experience (No Authentication Required):**
- ✅ **DJ/Host Profiles** - Meet the voices of Bellefu Radio with photos and information
- ✅ **Live Chat** - Real-time listener chat integration for community interaction
- ✅ **Show Profiles** - Featured show information with on-air status and host details
- 🔄 **Song History Widget** - Recently played tracks (placeholder ready for integration)
- 🔄 **Live Statistics** - Real-time listener counts and analytics (placeholder ready)
- 🔄 **Song Request System** - Listener request form (placeholder ready)
- 🔄 **Social Media Integration** - Social feeds and sharing (placeholder ready)
- ✅ **Live Radio Streaming** - Professional Radiojar player with play/pause/volume controls
- 24/7 streaming with agricultural content via stream: `https://stream.radiojar.com/v994btp2gd0uv`

**Optional User Features (Authentication Required):**
- Personal listening history tracking
- Listening statistics and analytics
- User profile management
- Personal dashboard with listening insights

**Admin Features:**
- ✅ **Radiojar Integration** - Full integration with Radiojar broadcasting platform
- Station information management
- User management
- ✅ **Widget Management** - Multiple Radiojar widgets integrated with custom styling

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)
- **Radiojar Account** (for broadcasting and widgets)

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

**Note:** Redis is no longer required as we now use Radiojar's real-time widgets instead of WebSockets.

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

### Important: Replace Placeholders with Real Radiojar Widgets

1. **Login to your Radiojar dashboard**
2. **Navigate to the Widgets/Embed section**
3. **Current Stream Configuration**: `v994btp2gd0uv`
4. **Integrated Widgets** (already configured):
   - ✅ **Player Widget** - Main streaming player with controls
   - ✅ **Current Show Widget** - Live program information
   - ✅ **Schedule Widget** - Weekly program schedule
   - ✅ **DJs Widget** - Host profiles and information
   - ✅ **Chat Widget** - Live listener chat
   - ✅ **Show Profile Widget** - Featured show details
5. **Remaining Widgets** (placeholders ready):
   - 🔄 **Statistics Widget** - Real-time listener analytics
   - 🔄 **Song History Widget** - Recently played tracks
   - 🔄 **Request Widget** - Song request form
   - 🔄 **Social Widget** - Social media integration
   - 🔄 **Mobile App Widget** - App promotion
   - 🔄 **Public Analytics Widget** - Performance dashboard
3. **Update the stream URL** in the admin panel:
   - Go to `/admin/`
   - Edit the "Bellefu Radio" station
   - Update the `stream_url` field with: https://stream.radiojar.com/v994btp2gd0uv
5. **Test all widgets** to ensure they load and function correctly

All widgets will automatically provide real-time updates and professional broadcasting features.

## 🎵 Available Radiojar Widgets

### Core Widgets
- ✅ **🎵 Player Widget** - Main streaming player with play/pause/volume controls
- ✅ **📅 Schedule Widget** - Weekly program schedule with live indicators
- ✅ **🎤 Current Show Widget** - Live program information with host details
- ✅ **👥 DJs Widget** - Host profiles with photos and information
- 🔄 **📊 Statistics Widget** - Real-time listener counts and analytics (placeholder ready)
- 🔄 **🎧 Recordings Widget** - Show archive with playback options (placeholder ready)

### Content Widgets
- ✅ **🎵 Show Profile Widget** - Featured show information with on-air status
- 🔄 **🎼 Song History Widget** - Recently played tracks with timestamps (placeholder ready)
- 🔄 **🎵 Now Playing Widget** - Current song/program information (placeholder ready)
- 🔄 **📱 Mobile App Widget** - Links to mobile apps (placeholder ready)

### Interactive Widgets
- ✅ **💬 Chat Widget** - Live listener chat functionality
- 🔄 **📱 Social Widget** - Social media integration and feeds (placeholder ready)
- 🔄 **🎤 Request Widget** - Song request and dedication form (placeholder ready)
- 🔄 **📞 Contact Widget** - Call-in information for live shows (placeholder ready)

### Analytics Widgets
- 🔄 **📈 Public Analytics Widget** - Public performance dashboard (placeholder ready)
- 🔄 **🗺️ Listener Map Widget** - Geographic listener distribution (placeholder ready)
- 🔄 **📊 Peak Times Widget** - Popular listening times and trends (placeholder ready)

## 🧪 Testing the Application

### 1. **Radiojar Widget Testing**

**Widget Loading Test**:
1. Visit the home page
2. Verify all Radiojar widgets load correctly
3. Test player functionality (play/pause/volume)
4. Check real-time updates in statistics widgets

**Interactive Features Test**:
1. Test live chat functionality (if enabled)
2. Submit a song request through the request widget
3. Verify social media integration works
4. Check mobile responsiveness of all widgets

**Archive & Recordings Test**:
1. Browse available show recordings
2. Test playback functionality
3. Verify download options (if enabled)
4. Check episode descriptions and metadata

### 2. **User Features Testing**

**Anonymous Usage**:
- Listen to radio without creating account
- View program schedules via Radiojar widgets
- Access show recordings and archives
- Use interactive features (chat, requests)

**Authenticated Usage**:
- Create account (optional)
- Personalized experience
- Manage profile

### 3. **Mobile Testing**
- All features work on mobile devices
- Radiojar widgets are mobile-responsive
- Responsive design adapts to all screen sizes
- Mobile app integration works correctly

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

**2. Radiojar Widgets Not Loading**
**Solution**: 
- Make sure you've replaced all placeholders with actual Radiojar embed codes
- Update the stream_url in the admin panel
- Check browser console for any JavaScript errors
- Verify your Radiojar account is active and widgets are enabled

**3. Missing Dependencies**
```
ModuleNotFoundError: No module named 'django'
```
**Solution**: Install all required dependencies:
```bash
pip install -r requirements.txt
```

## 📊 Radiojar Integration Features

### Real-time Updates
Integrated real-time features via Radiojar widgets:
- ✅ **Program Updates**: Current show information with automatic updates
- ✅ **Live Chat**: Real-time listener chat with community interaction
- ✅ **Schedule Updates**: Live program indicators and upcoming shows
- ✅ **Host Information**: Real-time DJ/host details and photos
- 🔄 **Live Statistics**: Real-time listener counts (placeholder ready)
- 🔄 **Now Playing**: Current song information (placeholder ready)

### Professional Broadcasting Features
1. ✅ **Program Scheduling**: Advanced scheduling with live indicators
2. ✅ **Host Management**: DJ profiles with photos and information
3. ✅ **Live Broadcasting**: Professional streaming via Radiojar infrastructure
4. ✅ **Community Features**: Live chat for listener engagement
5. 🔄 **Show Recordings**: Automatic recording with archive access (placeholder ready)
6. 🔄 **Listener Analytics**: Detailed statistics and geographic data (placeholder ready)
7. 🔄 **Mobile Integration**: Native mobile apps and responsive widgets (placeholder ready)

### Interactive Features
- ✅ **Live Chat**: Real-time listener communication
- 🔄 **Song Requests**: Listener request system with moderation (placeholder ready)
- 🔄 **Social Integration**: Social media feeds and sharing (placeholder ready)
- 🔄 **Call-in Management**: Phone integration for live shows (placeholder ready)

## 🚀 Production Deployment

### Radiojar Requirements
1. **Active Radiojar Account**: Professional broadcasting account
2. **Widget Configuration**: All desired widgets enabled and configured
3. **Stream Setup**: Live stream configured and tested
4. **Mobile Apps**: Optional mobile app setup for enhanced experience

### Deployment Commands
```bash
# Standard Django deployment
pip install gunicorn
gunicorn radio_project.wsgi:application --bind 0.0.0.0:8000
```

### Environment Variables
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 📈 Performance Benefits

### Radiojar Integration Advantages
- ✅ **Professional Broadcasting**: Enterprise-grade streaming infrastructure
- ✅ **Live Program Management**: Real-time show information and scheduling
- ✅ **Community Engagement**: Live chat and listener interaction
- ✅ **Host Profiles**: Professional DJ management and display
- ✅ **Mobile Responsive**: All widgets optimized for mobile devices
- 🔄 **Real-time Analytics**: Instant listener statistics (placeholder ready)
- 🔄 **Automatic Recordings**: Show archive and playback (placeholder ready)
- 🔄 **Interactive Features**: Requests and social integration (placeholder ready)

### Single Station Focus
- **Simplified UI**: Clean, focused user experience
- **Better Performance**: Optimized for single station streaming
- **Easier Maintenance**: Less complex codebase
- **Mobile Optimized**: Perfect for mobile radio listening
- **Professional Features**: All broadcasting features handled by Radiojar

## ✅ Integration Status

**Successfully Integrated Widgets:**
- ✅ Radiojar Player Widget (v994btp2gd0uv)
- ✅ Current Show Widget with live updates
- ✅ Weekly Schedule Widget with live indicators
- ✅ DJs/Hosts Profile Widget
- ✅ Live Chat Widget for community interaction
- ✅ Show Profile Widget with on-air status
- ✅ Custom CSS styling for all widgets
- ✅ Mobile-responsive design for all components

## 🔄 Development Workflow

### Testing Radiojar Integration
1. **Setup Radiojar Account**: Create and configure your broadcasting account
2. **Generate Widget Codes**: Create embed codes for all desired widgets
3. **Replace Placeholders**: Update templates with actual embed codes
4. **Run Django**: `python manage.py runserver`
5. **Test All Widgets**: Verify functionality of player, schedule, recordings, etc.

### Managing Content
1. **Use Radiojar Dashboard**: All program management through Radiojar
2. **Schedule Shows**: Use Radiojar's scheduling system
3. **Monitor Analytics**: Track performance through Radiojar widgets
4. **Manage Recordings**: Archive and organize show recordings

## 📚 Technical Architecture

### Radiojar Integration
- **Widget-Based Architecture**: All radio features via Radiojar widgets
- **Real-time API**: Live updates through Radiojar's infrastructure
- **Professional Broadcasting**: Enterprise streaming and analytics
- **Mobile Integration**: Native apps and responsive design

### Single Station Design
- **Focused Experience**: All features centered around one radio station
- **Simplified Models**: Removed unnecessary complexity
- **Optional Authentication**: Users can listen without accounts
- **Professional Features**: Broadcasting handled by Radiojar platform

## 🆘 Support

### Getting Help
1. **Check Browser Console**: Look for JavaScript errors from widgets
2. **Verify Radiojar Account**: Ensure your account is active and configured
3. **Test Widget Codes**: Verify embed codes are correct and current
4. **Check Network**: Ensure widgets can load from Radiojar's CDN

### Common Solutions
- **Update Widget Codes**: Regenerate embed codes from Radiojar dashboard
- **Clear Browser Cache**: Hard refresh (Ctrl+F5)
- **Check Radiojar Status**: Verify Radiojar services are operational
- **Update Dependencies**: `pip install -r requirements.txt --upgrade`

---

## 🎵 Ready to Broadcast!

Bellefu Radio now features:
- ✅ **Single station focus** for better user experience
- ✅ **Professional Radiojar integration** with 6 core widgets implemented
- ✅ **Live program information** with current show and schedule widgets
- ✅ **Community features** with live chat integration
- ✅ **Host profiles** with DJ information and photos
- ✅ **Custom styling** for all Radiojar widgets
- ✅ **Optional user authentication** - listen without accounts
- ✅ **Mobile-optimized** responsive design
- ✅ **Professional broadcasting** via stream: `https://stream.radiojar.com/v994btp2gd0uv`
- ✅ **Production-ready** with proper deployment instructions
- 🔄 **Additional widgets** ready for integration (statistics, song history, requests, etc.)

Start the server, configure your Radiojar widgets, and begin professional broadcasting with Bellefu Radio!