from django.core.management.base import BaseCommand
from radio_app.models import RadioStation


class Command(BaseCommand):
    help = 'Update stations with real working radio stream URLs'

    def handle(self, *args, **options):
        # Real working radio streams (these are actual live radio stations)
        real_streams = {
            'BBC World Service': 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
            'Capital FM Kenya': 'https://capitalfm.co.ke:8443/stream',
            'All India Radio': 'http://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
            'KCRW Santa Monica': 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air',
            'ABC Country Radio': 'https://live-radio02.mediahubaustralia.com/2CTW/mp3/',
            'Radio France Info': 'https://icecast.radiofrance.fr/franceinfo-midfi.mp3',
            'NPR News': 'https://npr-ice.streamguys1.com/live.mp3',
            'CBC Radio One': 'https://cbc_r1_tor.akacast.akamaistream.net/7/750/451661/v1/rc.akacast.akamaistream.net/cbc_r1_tor',
        }
        
        # Alternative working streams (backup options)
        backup_streams = [
            'http://ice1.somafm.com/groovesalad-256-mp3',  # SomaFM Groove Salad
            'http://ice1.somafm.com/dronezone-256-mp3',    # SomaFM Drone Zone
            'http://ice1.somafm.com/folkfwd-128-mp3',      # SomaFM Folk Forward
            'http://ice1.somafm.com/bagel-128-mp3',        # SomaFM BAGeL Radio
            'http://ice1.somafm.com/beatblender-128-mp3',  # SomaFM Beat Blender
            'http://ice1.somafm.com/indiepop-128-mp3',     # SomaFM Indie Pop Rocks
            'http://ice1.somafm.com/secretagent-128-mp3',  # SomaFM Secret Agent
            'http://ice1.somafm.com/spacestation-128-mp3', # SomaFM Space Station
        ]
        
        stations = RadioStation.objects.all()
        updated_count = 0
        backup_index = 0
        
        for station in stations:
            # Try to use the specific stream for known stations
            if station.name in real_streams:
                new_url = real_streams[station.name]
                self.stdout.write(f'Using specific stream for {station.name}')
            else:
                # Use backup streams for other stations
                if backup_index < len(backup_streams):
                    new_url = backup_streams[backup_index]
                    backup_index += 1
                else:
                    # Cycle back to beginning if we run out
                    backup_index = 0
                    new_url = backup_streams[backup_index]
                    backup_index += 1
                
                self.stdout.write(f'Using backup stream for {station.name}')
            
            # Update the stream URL
            old_url = station.stream_url
            station.stream_url = new_url
            station.save()
            updated_count += 1
            
            self.stdout.write(f'Updated {station.name}:')
            self.stdout.write(f'  Old: {old_url}')
            self.stdout.write(f'  New: {new_url}')
            self.stdout.write('')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {updated_count} stations with real radio streams'
            )
        )
        
        self.stdout.write(
            self.style.WARNING(
                'Note: Some streams may not work due to CORS policies or geographic restrictions.\n'
                'This is normal for internet radio streams when accessed from web browsers.'
            )
        )