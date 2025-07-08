#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🚀 Starting Bellefu Radio deployment build..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Set Django settings module
export DJANGO_SETTINGS_MODULE=radio_project.settings

# Clear any existing database (for fresh deployment)
echo "🗄️ Setting up database..."
if [ -f "db.sqlite3" ]; then
    echo "Removing existing SQLite database..."
    rm -f db.sqlite3
fi

# Create migrations for radio_app
echo "📝 Creating migrations..."
python manage.py makemigrations radio_app

# Apply all migrations (Django built-in + radio_app)
echo "🔄 Applying migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input

# Create superuser if it doesn't exist
echo "👤 Setting up admin user..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@bellefuradio.com', 'admin123')
    print('✅ Superuser created: admin/admin123')
else:
    print('✅ Superuser already exists')
"

# Populate Bellefu Radio data (only run once)
echo "🎵 Setting up Bellefu Radio data..."
python manage.py populate_sample_data || echo "⚠️ Sample data already exists or failed to load"

echo "✅ Build completed successfully!"
echo ""
echo "🎵 BELLEFU RADIO DEPLOYMENT READY!"
echo "📡 Single station focus with optional user accounts"
echo "🔴 Real-time WebSocket updates enabled"
echo "📱 Mobile-responsive design"
echo "⚙️ Admin panel: /admin/ (admin/admin123)"
echo ""
echo "⚠️ IMPORTANT POST-DEPLOYMENT STEPS:"
echo "1. Change admin password immediately"
echo "2. Update stream_url with your Radiojar URL"
echo "3. Replace Radiojar placeholder in templates/home.html"
echo "4. Test WebSocket connections"