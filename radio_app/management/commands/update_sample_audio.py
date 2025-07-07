from django.core.management.base import BaseCommand
from radio_app.models import RadioStation
import os
from django.conf import settings


class Command(BaseCommand):
    help = 'Update sample stations to use local audio file'

    def handle(self, *args, **options):
        # Check if setup.mp3 exists in media/audio/
        audio_file_path = os.path.join(settings.MEDIA_ROOT, 'audio', 'setup.mp3')
        
        if not os.path.exists(audio_file_path):
            self.stdout.write(
                self.style.WARNING(
                    f'Audio file not found at {audio_file_path}\n'
                    'Please copy your setup.mp3 file to media/audio/setup.mp3'
                )
            )
            return
        
        # Update all stations to use the local audio file
        local_audio_url = f"{settings.MEDIA_URL}audio/setup.mp3"
        
        stations = RadioStation.objects.all()
        updated_count = 0
        
        for station in stations:
            # Update stream URL to point to local file
            station.stream_url = f"http://localhost:8000{local_audio_url}"
            station.save()
            updated_count += 1
            self.stdout.write(f'Updated {station.name}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {updated_count} stations to use local audio file'
            )
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Audio URL: http://localhost:8000{local_audio_url}'
            )
        )