from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from radio_app.models import RadioStation, Event


class Command(BaseCommand):
    help = 'Populate the database with Bellefu Radio data'

    def handle(self, *args, **options):
        self.stdout.write('Creating Bellefu Radio data...')

        # Create admin user if it doesn't exist
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@bellefuradio.com',
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

        # Create the single Bellefu Radio station
        # NOTE: You'll need to replace this stream_url with your actual Radiojar stream URL
        station_data = {
            'name': 'Bellefu Radio',
            'description': 'Your premier agricultural radio station broadcasting from Nigeria. Featuring farming news, weather updates, market prices, and educational content for farmers and agricultural communities.',
            'stream_url': 'https://your-radiojar-stream-url-here.com/stream',  # Replace with actual Radiojar URL
            'website_url': 'https://bellefuradio.com',
            'country': 'Nigeria',
            'language': 'English',
            'quality': 'high',
            'bitrate': 256,
            'listeners_count': 0,
            'is_active': True,
        }

        station, created = RadioStation.objects.get_or_create(
            name='Bellefu Radio',
            defaults=station_data
        )
        if created:
            self.stdout.write(f'Created station: {station.name}')
        else:
            self.stdout.write(f'Station already exists: {station.name}')

        # Create sample events for Bellefu Radio
        now = timezone.now()
        events_data = [
            {
                'title': 'Morning Farm Report',
                'description': 'Daily agricultural news, weather updates, and market prices for Nigerian farmers',
                'event_type': 'news',
                'start_time': now.replace(hour=6, minute=0, second=0, microsecond=0) + timedelta(days=1),
                'end_time': now.replace(hour=7, minute=0, second=0, microsecond=0) + timedelta(days=1),
                'host': 'Chief Emeka Okafor',
                'is_featured': True,
            },
            {
                'title': 'Cassava Farming Workshop',
                'description': 'Learn modern cassava cultivation techniques and pest management strategies',
                'event_type': 'live_show',
                'start_time': now.replace(hour=14, minute=0, second=0, microsecond=0) + timedelta(days=2),
                'end_time': now.replace(hour=16, minute=0, second=0, microsecond=0) + timedelta(days=2),
                'host': 'Dr. Blessing Okoro',
                'is_featured': True,
            },
            {
                'title': 'Weather Forecast for Farmers',
                'description': 'Weekly weather forecast and farming recommendations for the Niger Delta region',
                'event_type': 'other',
                'start_time': now.replace(hour=18, minute=0, second=0, microsecond=0),
                'end_time': now.replace(hour=18, minute=30, second=0, microsecond=0),
                'host': 'Meteorologist James Udo',
                'is_featured': False,
            },
            {
                'title': 'Fish Farming Success Stories',
                'description': 'Interviews with successful fish farmers sharing their experiences and tips',
                'event_type': 'interview',
                'start_time': now.replace(hour=16, minute=0, second=0, microsecond=0) + timedelta(days=3),
                'end_time': now.replace(hour=17, minute=0, second=0, microsecond=0) + timedelta(days=3),
                'host': 'Mrs. Grace Nwosu',
                'is_featured': True,
            },
            {
                'title': 'Market Price Updates',
                'description': 'Current market prices for agricultural products across major Nigerian markets',
                'event_type': 'news',
                'start_time': now.replace(hour=12, minute=0, second=0, microsecond=0) + timedelta(days=1),
                'end_time': now.replace(hour=12, minute=30, second=0, microsecond=0) + timedelta(days=1),
                'host': 'Market Correspondent',
                'is_featured': False,
            },
            {
                'title': 'Palm Oil Production Masterclass',
                'description': 'Comprehensive guide to sustainable palm oil production and processing',
                'event_type': 'live_show',
                'start_time': now.replace(hour=10, minute=0, second=0, microsecond=0) + timedelta(days=4),
                'end_time': now.replace(hour=12, minute=0, second=0, microsecond=0) + timedelta(days=4),
                'host': 'Engineer Chidi Nwosu',
                'is_featured': True,
            },
            {
                'title': 'Evening Agricultural Talk',
                'description': 'Discussion on modern farming techniques and agricultural innovations',
                'event_type': 'talk_show',
                'start_time': now.replace(hour=19, minute=0, second=0, microsecond=0) + timedelta(days=1),
                'end_time': now.replace(hour=20, minute=0, second=0, microsecond=0) + timedelta(days=1),
                'host': 'Prof. Adaora Okonkwo',
                'is_featured': False,
            },
        ]

        for event_data in events_data:
            event_data['station'] = station
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                station=station,
                defaults=event_data
            )
            if created:
                self.stdout.write(f'Created event: {event.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with Bellefu Radio data!')
        )
        self.stdout.write('')
        self.stdout.write('🎵 BELLEFU RADIO STATION CREATED:')
        self.stdout.write('✓ Bellefu Radio - Agricultural Broadcasting')
        self.stdout.write('')
        self.stdout.write('📅 SAMPLE PROGRAMS ADDED:')
        self.stdout.write('✓ Morning Farm Report (Daily)')
        self.stdout.write('✓ Cassava Farming Workshop')
        self.stdout.write('✓ Weather Forecast for Farmers')
        self.stdout.write('✓ Fish Farming Success Stories')
        self.stdout.write('✓ Market Price Updates')
        self.stdout.write('✓ Palm Oil Production Masterclass')
        self.stdout.write('✓ Evening Agricultural Talk')
        self.stdout.write('')
        self.stdout.write('⚠️  IMPORTANT: Update the stream_url in the station data')
        self.stdout.write('   with your actual Radiojar stream URL!')
        self.stdout.write('')
        self.stdout.write('You can now access the admin panel at /admin/')
        self.stdout.write('Username: admin, Password: admin123')