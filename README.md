# 🎵 Bellefu Radio - Django Web Application

A Django web application for Bellefu Radio - your premier agricultural radio station. This application provides a single radio station streaming experience with real-time features, program scheduling, and optional user accounts for enhanced features.

## 🚀 Features

**Core Radio Experience (No Authentication Required):**
- Listen to Bellefu Radio live stream via Radiojar player widget
- View current and upcoming programs via Radiojar schedule widget
- Browse and play show recordings via Radiojar archive widget
- Real-time listener statistics via Radiojar analytics widgets
- Song history and now playing information
- Live chat and social media integration
- Song request and call-in functionality
- Mobile-friendly responsive design
- 24/7 streaming with agricultural content

**Optional User Features (Authentication Required):**
- Personal listening history tracking
- Listening statistics and analytics
- User profile management
- Personal dashboard with listening insights

**Admin Features:**
- Radiojar dashboard integration for program management
- Station information management
- User management
- Widget customization and embed code management

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
3. **Generate embed codes** for all the widgets you want to use:
   - Player Widget (main streaming player)
   - Schedule Widget (program schedule)
   - Recordings Widget (show archive)
   - Statistics Widget (listener analytics)
   - Now Playing Widget (current song/program)
   - Song History Widget (recently played)
   - Chat Widget (live chat)
   - Request Widget (song requests)
   - And more...
4. **Edit `templates/home.html`** and replace each placeholder div with the corresponding Radiojar embed code
3. **Update the stream URL** in the admin panel:
   - Go to `/admin/`
   - Edit the "Bellefu Radio" station
   - Update the `stream_url` field with: https://stream.radiojar.com/v994btp2gd0uv
5. **Test all widgets** to ensure they load and function correctly

All widgets will automatically provide real-time updates and professional broadcasting features.

## 🎵 Available Radiojar Widgets

### Core Widgets
- **🎵 Player Widget** - Main streaming player with play/pause/volume controls
- **📊 Statistics Widget** - Real-time listener counts and analytics
- **📅 Schedule Widget** - Current and upcoming program schedule
- **🎧 Recordings Widget** - Show archive with playback and download options

### Content Widgets
- **🎼 Song History Widget** - Recently played tracks with timestamps
- **🎵 Now Playing Widget** - Current song/program information
- **📱 Mobile App Widget** - Links to mobile apps and mobile experience

### Interactive Widgets
- **💬 Chat Widget** - Live listener chat functionality
- **📱 Social Widget** - Social media integration and feeds
- **🎤 Request Widget** - Song request and dedication form
- **📞 Contact Widget** - Call-in information for live shows

### Analytics Widgets
- **📈 Public Analytics Widget** - Public performance dashboard
- **🗺️ Listener Map Widget** - Geographic listener distribution
- **📊 Peak Times Widget** - Popular listening times and trends

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
All real-time features are now handled by Radiojar widgets:
- **Live Statistics**: Real-time listener counts and analytics
- **Program Updates**: Current and upcoming show information
- **Now Playing**: Current song/program information with automatic updates
- **Chat Integration**: Live listener chat with real-time messaging

### Professional Broadcasting Features
1. **Show Recordings**: Automatic recording with archive access
2. **Program Scheduling**: Advanced scheduling with live indicators
3. **Listener Analytics**: Detailed statistics and geographic data
4. **Mobile Integration**: Native mobile apps and responsive widgets

### Interactive Features
- **Live Chat**: Real-time listener communication
- **Song Requests**: Listener request system with moderation
- **Social Integration**: Social media feeds and sharing
- **Call-in Management**: Phone integration for live shows

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
- **Professional Broadcasting**: Enterprise-grade streaming infrastructure
- **Real-time Analytics**: Instant listener statistics and engagement metrics
- **Automatic Recordings**: All shows automatically recorded and archived
- **Global CDN**: Fast streaming worldwide with automatic failover
- **Mobile Optimized**: Native mobile apps and responsive widgets
- **Interactive Features**: Live chat, requests, and social integration

### Single Station Focus
- **Simplified UI**: Clean, focused user experience
- **Better Performance**: Optimized for single station streaming
- **Easier Maintenance**: Less complex codebase
- **Mobile Optimized**: Perfect for mobile radio listening
- **Professional Features**: All broadcasting features handled by Radiojar

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
- ✅ **Professional Radiojar integration** with all broadcasting widgets
- ✅ **Show recordings and archives** for on-demand listening
- ✅ **Real-time analytics and statistics** via Radiojar widgets
- ✅ **Interactive features** including chat, requests, and social integration
- ✅ **Optional user authentication** - listen without accounts
- ✅ **Mobile-optimized** responsive design
- ✅ **Professional broadcasting** with enterprise-grade features
- ✅ **Production-ready** with proper deployment instructions

Start the server, configure your Radiojar widgets, and begin professional broadcasting with Bellefu Radio!