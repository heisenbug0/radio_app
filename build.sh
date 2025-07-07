#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Set Django settings module
export DJANGO_SETTINGS_MODULE=radio_project.settings

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Create superuser if it doesn't exist (optional)
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@bellefuradio.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

# Populate sample data (optional - only run once)
python manage.py populate_sample_data || echo "Sample data already exists or failed to load"