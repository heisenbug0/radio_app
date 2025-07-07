from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from radio_app.models import Category, RadioStation, Event, BlogPost
import random


class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

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
                'name': 'BBC World Service',
                'description': 'International news and current affairs from the BBC',
                'stream_url': 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
                'website_url': 'https://www.bbc.co.uk/worldservice',
                'country': 'Canada',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1250,
            },
            {
                'name': 'Capital FM Kenya',
                'description': 'Kenya\'s hit music station with news and entertainment',
                'stream_url': 'https://capitalfm.co.ke:8443/stream',
                'website_url': 'https://www.capitalfm.co.ke',
                'country': 'Kenya',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 890,
            },
            {
                'name': 'All India Radio',
                'description': 'National broadcaster of India with news and cultural programs',
                'stream_url': 'http://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
                'website_url': 'https://www.allindiaradio.gov.in',
                'country': 'India',
                'language': 'Hindi',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 2100,
            },
            {
                'name': 'KCRW Santa Monica',
                'description': 'Eclectic music, news and cultural programming from California',
                'stream_url': 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air',
                'website_url': 'https://www.kcrw.com',
                'country': 'USA',
                'language': 'English',
                'quality': 'ultra',
                'bitrate': 320,
                'listeners_count': 3500,
            },
            {
                'name': 'ABC Country Radio',
                'description': 'Australian country music and rural news',
                'stream_url': 'https://live-radio02.mediahubaustralia.com/2CTW/mp3/',
                'website_url': 'https://www.abc.net.au/radio/country',
                'country': 'Australia',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 750,
            },
            {
                'name': 'Radio France Info',
                'description': 'French news and information radio',
                'stream_url': 'https://icecast.radiofrance.fr/franceinfo-midfi.mp3',
                'website_url': 'https://www.francetvinfo.fr/radio-france-info',
                'country': 'France',
                'language': 'French',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 1800,
            },
            {
                'name': 'NPR News',
                'description': 'National Public Radio with news, talk, and cultural programming',
                'stream_url': 'https://npr-ice.streamguys1.com/live.mp3',
                'website_url': 'https://www.npr.org',
                'country': 'USA',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 3200,
            },
            {
                'name': 'CBC Radio One',
                'description': 'Canadian public radio with news, current affairs and documentaries',
                'stream_url': 'https://cbc_r1_tor.akacast.akamaistream.net/7/750/451661/v1/rc.akacast.akamaistream.net/cbc_r1_tor',
                'website_url': 'https://www.cbc.ca/radio/radio1',
                'country': 'Canada',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 2400,
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
        self.stdout.write('You can now access the admin panel at /admin/')
        self.stdout.write('Username: admin, Password: admin123')