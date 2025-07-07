from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
from radio_app.models import Category, RadioStation, Event, BlogPost
import random
import os


class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create media/audio directory for local audio files
        audio_dir = os.path.join(settings.MEDIA_ROOT, 'audio')
        os.makedirs(audio_dir, exist_ok=True)
        
        # Check if setup.mp3 exists
        audio_file_path = os.path.join(audio_dir, 'setup.mp3')
        use_local_audio = os.path.exists(audio_file_path)
        
        if use_local_audio:
            self.stdout.write('✓ Found setup.mp3 - using local audio file for all stations')
            base_stream_url = "http://localhost:8000/media/audio/setup.mp3"
        else:
            self.stdout.write('⚠ setup.mp3 not found - using placeholder URLs')
            self.stdout.write('  Copy your setup.mp3 to media/audio/setup.mp3 for working audio')
            base_stream_url = "http://localhost:8000/media/audio/setup.mp3"

        # Create categories
        categories_data = [
            {'name': 'Agriculture', 'description': 'Farming and agricultural content', 'icon': 'agriculture'},
            {'name': 'News', 'description': 'Local and international news', 'icon': 'news'},
            {'name': 'Music', 'description': 'Various music genres', 'icon': 'music'},
            {'name': 'Talk Shows', 'description': 'Discussion and talk programs', 'icon': 'microphone'},
            {'name': 'Education', 'description': 'Educational content', 'icon': 'education'},
            {'name': 'Weather', 'description': 'Weather updates and forecasts', 'icon': 'weather'},
        ]

        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create radio stations
        stations_data = [
            {
                'name': 'Nigeria Farm Radio',
                'description': 'Agricultural news and farming tips for Nigerian farmers',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/nigeria-farm-radio',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 850,
            },
            {
                'name': 'West Africa Agricultural Radio',
                'description': 'Regional farming information and market prices',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/west-africa-agri',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 650,
            },
            {
                'name': 'Hausa Farm Network',
                'description': 'Agricultural programming in Hausa language',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/hausa-farm',
                'country': 'Nigeria',
                'language': 'Hausa',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 720,
            },
            {
                'name': 'Igbo Agricultural Voice',
                'description': 'Farming education and news in Igbo language',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/igbo-agri',
                'country': 'Nigeria',
                'language': 'Igbo',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 580,
            },
            {
                'name': 'Yoruba Farm Radio',
                'description': 'Agricultural content and market updates in Yoruba',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/yoruba-farm',
                'country': 'Nigeria',
                'language': 'Yoruba',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 490,
            },
            {
                'name': 'African Music & Culture',
                'description': 'Traditional and modern African music with cultural programs',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/african-music',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'ultra',
                'bitrate': 320,
                'listeners_count': 920,
            },
            {
                'name': 'Ghana Farm Connect',
                'description': 'Cross-border agricultural information for West Africa',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/ghana-farm',
                'country': 'Ghana',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 380,
            },
            {
                'name': 'International Farm News',
                'description': 'Global agricultural news and commodity prices',
                'stream_url': base_stream_url,
                'website_url': 'https://example.com/intl-farm-news',
                'country': 'International',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1200,
            },
        ]

        stations = []
        for i, station_data in enumerate(stations_data):
            station_data['category'] = categories[i % len(categories)]
            station, created = RadioStation.objects.get_or_create(
                name=station_data['name'],
                defaults=station_data
            )
            stations.append(station)
            if created:
                self.stdout.write(f'Created station: {station.name}')

        # Create admin user if it doesn't exist
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@farmradio.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Created admin user (username: admin, password: admin123)')

        # Create sample events
        now = timezone.now()
        events_data = [
            {
                'title': 'Morning Farm Report',
                'description': 'Daily agricultural news and market prices',
                'event_type': 'news',
                'start_time': now + timedelta(hours=1),
                'end_time': now + timedelta(hours=2),
                'host': 'John Farmer',
                'is_featured': True,
            },
            {
                'title': 'Crop Disease Prevention Workshop',
                'description': 'Learn about preventing common crop diseases',
                'event_type': 'live_show',
                'start_time': now + timedelta(days=1, hours=10),
                'end_time': now + timedelta(days=1, hours=12),
                'host': 'Dr. Sarah Green',
                'is_featured': True,
            },
            {
                'title': 'Weather Forecast Special',
                'description': 'Extended weather forecast for the farming season',
                'event_type': 'other',
                'start_time': now + timedelta(hours=6),
                'end_time': now + timedelta(hours=6, minutes=30),
                'host': 'Mike Weather',
                'is_featured': False,
            },
        ]

        for i, event_data in enumerate(events_data):
            event_data['station'] = stations[i % len(stations)]
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                defaults=event_data
            )
            if created:
                self.stdout.write(f'Created event: {event.title}')

        # Create sample blog posts
        blog_posts_data = [
            {
                'title': 'Top 10 Farming Tips for Beginners',
                'slug': 'top-10-farming-tips-beginners',
                'content': '''
                Starting a farm can be overwhelming, but with the right knowledge and preparation, 
                anyone can become a successful farmer. Here are our top 10 tips for beginners:

                1. Start small and gradually expand
                2. Choose crops suitable for your climate
                3. Invest in quality soil preparation
                4. Learn about pest management
                5. Plan your irrigation system carefully
                6. Keep detailed records
                7. Connect with local farming communities
                8. Stay updated with agricultural news
                9. Consider sustainable farming practices
                10. Be patient and persistent

                Remember, farming is both an art and a science. Don't be afraid to experiment 
                and learn from your mistakes.
                ''',
                'excerpt': 'Essential tips for new farmers to start their agricultural journey successfully.',
                'status': 'published',
                'tags': 'farming, beginners, agriculture, tips',
                'is_featured': True,
                'published_at': now - timedelta(days=2),
            },
            {
                'title': 'Understanding Weather Patterns for Better Crop Planning',
                'slug': 'weather-patterns-crop-planning',
                'content': '''
                Weather plays a crucial role in agricultural success. Understanding local weather 
                patterns can help farmers make better decisions about when to plant, irrigate, 
                and harvest their crops.

                Key factors to consider:
                - Seasonal rainfall patterns
                - Temperature variations
                - Frost dates
                - Wind patterns
                - Humidity levels

                By monitoring these factors and using weather forecasting tools, farmers can 
                optimize their crop planning and reduce weather-related risks.
                ''',
                'excerpt': 'Learn how weather patterns affect farming and how to use this knowledge for better crop planning.',
                'status': 'published',
                'tags': 'weather, farming, crop planning, agriculture',
                'is_featured': False,
                'published_at': now - timedelta(days=5),
            },
            {
                'title': 'The Future of Sustainable Agriculture',
                'slug': 'future-sustainable-agriculture',
                'content': '''
                Sustainable agriculture is becoming increasingly important as we face challenges 
                like climate change, soil degradation, and water scarcity. This article explores 
                the latest trends and technologies in sustainable farming.

                Topics covered:
                - Precision agriculture
                - Organic farming methods
                - Water conservation techniques
                - Renewable energy in farming
                - Biodiversity preservation

                The future of farming lies in balancing productivity with environmental stewardship.
                ''',
                'excerpt': 'Exploring the latest trends and technologies in sustainable farming practices.',
                'status': 'published',
                'tags': 'sustainable agriculture, environment, technology, future',
                'is_featured': True,
                'published_at': now - timedelta(days=1),
            },
        ]

        for post_data in blog_posts_data:
            post_data['author'] = admin_user
            post, created = BlogPost.objects.get_or_create(
                slug=post_data['slug'],
                defaults=post_data
            )
            if created:
                self.stdout.write(f'Created blog post: {post.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data!')
        )
        
        if use_local_audio:
            self.stdout.write('')
            self.stdout.write(
                self.style.SUCCESS('✓ All stations configured to use your local audio file')
            )
            self.stdout.write('  Audio URL: http://localhost:8000/media/audio/setup.mp3')
        else:
            self.stdout.write('')
            self.stdout.write(
                self.style.WARNING('⚠ To enable audio playback:')
            )
            self.stdout.write('  1. Copy your setup.mp3 to media/audio/setup.mp3')
            self.stdout.write('  2. Run: python manage.py populate_sample_data (again)')
            self.stdout.write('  3. Start server: python manage.py runserver')
        
        self.stdout.write('You can now access the admin panel at /admin/')
        self.stdout.write('Username: admin, Password: admin123')