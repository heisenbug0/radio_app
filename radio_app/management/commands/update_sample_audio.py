from django.core.management.base import BaseCommand
from radio_app.models import RadioStation
import os
from django.conf import settings


class Command(BaseCommand):
    help = 'Update all stations to use local audio file for demo purposes'

    def handle(self, *args, **options):
        # Create media/audio directory if it doesn't exist
        audio_dir = os.path.join(settings.MEDIA_ROOT, 'audio')
        os.makedirs(audio_dir, exist_ok=True)
        
        # Check if setup.mp3 exists in media/audio/
        audio_file_path = os.path.join(audio_dir, 'setup.mp3')
        
        if not os.path.exists(audio_file_path):
            self.stdout.write(
                self.style.WARNING(
                    f'Audio file not found at {audio_file_path}\n'
                    'Please copy your setup.mp3 file to media/audio/setup.mp3\n'
                    'You can do this by running:\n'
                    'cp /path/to/your/setup.mp3 media/audio/setup.mp3'
                )
            )
            return
        
        # Update all stations to use the local audio file
        local_audio_url = f"/media/audio/setup.mp3"
        
        stations = RadioStation.objects.all()
        updated_count = 0
        
        for station in stations:
            # Update stream URL to point to local file
            station.stream_url = f"http://localhost:8000{local_audio_url}"
            station.save()
            updated_count += 1
            self.stdout.write(f'✓ Updated {station.name}')
        
        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {updated_count} stations to use local audio file'
            )
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'All stations now use: http://localhost:8000{local_audio_url}'
            )
        )
        
        self.stdout.write('')
        self.stdout.write('Next steps:')
        self.stdout.write('1. Copy your setup.mp3 to media/audio/setup.mp3')
        self.stdout.write('2. Start the development server: python manage.py runserver')
        self.stdout.write('3. Test the audio player on any station')