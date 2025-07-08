from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from radio_app.models import RadioStation


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
        # Clear existing stations first to avoid MultipleObjectsReturned error
        RadioStation.objects.all().delete()
        
        # Create the single Bellefu Radio station
        station_data = {
            'name': 'Bellefu Radio',
            'description': 'Your premier agricultural radio station broadcasting from Nigeria. Featuring farming news, weather updates, market prices, and educational content for farmers and agricultural communities.',
            'stream_url': 'https://your-radiojar-stream-url-here.com/stream',  # Replace with actual Radiojar URL
            'website_url': 'https://bellefuradio.com',
            'country': 'Nigeria',
            'language': 'English',
            'quality': 'high',
            'bitrate': 256,
            'is_active': True,
        }

        station = RadioStation.objects.create(**station_data)
        self.stdout.write(f'Created station: {station.name}')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with Bellefu Radio data!')
        )
        self.stdout.write('')
        self.stdout.write('🎵 BELLEFU RADIO STATION CREATED:')
        self.stdout.write('✓ Bellefu Radio - Agricultural Broadcasting')
        self.stdout.write('')
        self.stdout.write('📡 RADIOJAR INTEGRATION:')
        self.stdout.write('✓ Events and programs will be managed via Radiojar widgets')
        self.stdout.write('✓ Listening history will be tracked via Radiojar analytics')
        self.stdout.write('✓ Listener counts will be displayed via Radiojar player')
        self.stdout.write('')
        self.stdout.write('⚠️  IMPORTANT: Update the stream_url in the station data')
        self.stdout.write('   with your actual Radiojar stream URL!')
        self.stdout.write('')
        self.stdout.write('You can now access the admin panel at /admin/')
        self.stdout.write('Username: admin, Password: admin123')