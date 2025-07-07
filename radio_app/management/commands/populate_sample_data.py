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

        # Create radio stations with REAL working streams
        stations_data = [
            # Nigerian Local Stations (Port Harcourt & Rivers State)
            {
                'name': 'Garden City Radio 101.1 FM',
                'description': 'Port Harcourt premier radio station with local news, music and talk shows',
                'stream_url': 'https://stream.zeno.fm/gardencityradio',
                'website_url': 'https://gardencityradio.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1200,
            },
            {
                'name': 'Rhythm FM Port Harcourt 93.7',
                'description': 'Contemporary music and entertainment for Port Harcourt',
                'stream_url': 'https://stream.zeno.fm/rhythmfmph',
                'website_url': 'https://rhythmfm.com.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 980,
            },
            {
                'name': 'Nigeria Info Port Harcourt 92.3 FM',
                'description': 'News, current affairs and information for Rivers State',
                'stream_url': 'https://stream.zeno.fm/nigeriainfoph',
                'website_url': 'https://nigeriainfofm.com',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 750,
            },
            {
                'name': 'Love FM Port Harcourt 104.5',
                'description': 'Love songs, relationship talks and lifestyle content',
                'stream_url': 'https://stream.zeno.fm/lovefmph',
                'website_url': 'https://lovefm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 650,
            },
            {
                'name': 'Rivers State Broadcasting Corporation',
                'description': 'Official government radio with local news and programs',
                'stream_url': 'https://stream.zeno.fm/rsbc',
                'website_url': 'https://rsbc.gov.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 420,
            },
            {
                'name': 'Treasure FM 98.5',
                'description': 'Port Harcourt community radio with local content',
                'stream_url': 'https://stream.zeno.fm/treasurefm',
                'website_url': 'https://treasurefm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 380,
            },
            # Nigerian National Stations
            {
                'name': 'BBC World Service',
                'description': 'International news and current affairs from the BBC',
                'stream_url': 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
                'website_url': 'https://www.bbc.co.uk/worldservice',
                'country': 'United Kingdom',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1250,
            },
            {
                'name': 'Cool FM Nigeria 96.9',
                'description': 'Popular Nigerian radio station with music and talk',
                'stream_url': 'https://stream.zeno.fm/f3nbhvq8k18uv',
                'website_url': 'https://coolfm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1850,
            },
            {
                'name': 'Wazobia FM 95.1',
                'description': 'Nigerian pidgin radio station with comedy and music',
                'stream_url': 'https://stream.zeno.fm/17q2aa9ek18uv',
                'website_url': 'https://wazobiafm.ng',
                'country': 'Nigeria',
                'language': 'Pidgin English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1680,
            },
            {
                'name': 'Radio Nigeria Lagos',
                'description': 'National broadcaster with news, culture and music',
                'stream_url': 'https://stream.zeno.fm/0r0xa792kwzuv',
                'website_url': 'https://www.radionigeria.gov.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 1250,
            },
            {
                'name': 'Classic FM 97.3',
                'description': 'Nigerian station with classic hits and talk shows',
                'stream_url': 'https://stream.zeno.fm/classicfm',
                'website_url': 'https://classicfm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 920,
            },
            {
                'name': 'City FM 105.1',
                'description': 'Urban contemporary music and lifestyle programming',
                'stream_url': 'https://stream.zeno.fm/cityfm',
                'website_url': 'https://cityfm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 780,
            },
            {
                'name': 'Naija FM 102.7',
                'description': 'Nigerian music, entertainment and cultural programs',
                'stream_url': 'https://stream.zeno.fm/naijafm',
                'website_url': 'https://naijafm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 690,
            },
            {
                'name': 'Radio Biafra London',
                'description': 'Igbo language radio with cultural and political content',
                'stream_url': 'https://stream.zeno.fm/8wv4d7q8k18uv',
                'website_url': 'https://radiobiafra.co',
                'country': 'Nigeria',
                'language': 'Igbo',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 520,
            },
            {
                'name': 'Bond FM 92.9',
                'description': 'Lagos-based station with contemporary Nigerian music',
                'stream_url': 'https://stream.zeno.fm/bondfm',
                'website_url': 'https://bondfm.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 480,
            },
            # West African Stations
            {
                'name': 'Ghana Broadcasting Corporation',
                'description': 'National radio of Ghana with news and music',
                'stream_url': 'https://stream.zeno.fm/gbcradio',
                'website_url': 'https://gbcghana.com',
                'country': 'Ghana',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 450,
            },
            # International Stations
            {
                'name': 'Voice of America Africa',
                'description': 'VOA programming focused on African affairs',
                'stream_url': 'https://voa-ingest.akamaized.net/hls/live/2033878/tvmc07/playlist.m3u8',
                'website_url': 'https://www.voanews.com/africa',
                'country': 'United States',
                'language': 'English',
                'quality': 'high',
                'bitrate': 256,
                'listeners_count': 1100,
            },
            {
                'name': 'BBC Hausa Service',
                'description': 'BBC World Service in Hausa language',
                'stream_url': 'http://stream.live.vc.bbcmedia.co.uk/bbc_hausa_radio',
                'website_url': 'https://www.bbc.com/hausa',
                'country': 'United Kingdom',
                'language': 'Hausa',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 680,
            },
            {
                'name': 'Radio France Internationale Africa',
                'description': 'RFI programming for African audiences',
                'stream_url': 'http://live02.rfi.fr/rfimonde-64.mp3',
                'website_url': 'https://www.rfi.fr/en/africa',
                'country': 'France',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 590,
            },
            # Agricultural Focus Stations
            {
                'name': 'Farm Radio International',
                'description': 'Dedicated agricultural programming for African farmers',
                'stream_url': 'https://stream.zeno.fm/farmradio',
                'website_url': 'https://farmradio.org',
                'country': 'Canada',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 320,
            },
            {
                'name': 'Agric Radio Nigeria',
                'description': 'Nigerian agricultural radio with farming tips and market prices',
                'stream_url': 'https://stream.zeno.fm/agricradio',
                'website_url': 'https://agricradio.ng',
                'country': 'Nigeria',
                'language': 'English',
                'quality': 'medium',
                'bitrate': 128,
                'listeners_count': 280,
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

        # Create sample events
        now = timezone.now()
        events_data = [
            {
                'title': 'Port Harcourt Morning Market Report',
                'description': 'Daily agricultural market prices from Mile 3 Market',
                'event_type': 'news',
                'start_time': now + timedelta(hours=1),
                'end_time': now + timedelta(hours=1, minutes=30),
                'host': 'Chief Emeka Okafor',
                'is_featured': True,
            },
            {
                'title': 'Rivers State Farming Workshop',
                'description': 'Learn about cassava and yam cultivation in Rivers State',
                'event_type': 'live_show',
                'start_time': now + timedelta(days=1, hours=14),
                'end_time': now + timedelta(days=1, hours=16),
                'host': 'Dr. Blessing Okoro',
                'is_featured': True,
            },
            {
                'title': 'Niger Delta Weather Update',
                'description': 'Weather forecast for farming communities in the Niger Delta',
                'event_type': 'other',
                'start_time': now + timedelta(hours=6),
                'end_time': now + timedelta(hours=6, minutes=30),
                'host': 'Meteorologist James Udo',
                'is_featured': False,
            },
            {
                'title': 'Igbo Cultural Hour',
                'description': 'Traditional Igbo music and cultural discussions',
                'event_type': 'music_special',
                'start_time': now + timedelta(days=2, hours=18),
                'end_time': now + timedelta(days=2, hours=20),
                'host': 'Nkem Owoh',
                'is_featured': True,
            },
            {
                'title': 'Oil & Gas Industry Talk',
                'description': 'Discussion on oil industry impact on local agriculture',
                'event_type': 'talk_show',
                'start_time': now + timedelta(days=3, hours=16),
                'end_time': now + timedelta(days=3, hours=17),
                'host': 'Engineer Chidi Nwosu',
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

        # Create sample blog posts with Nigerian content
        blog_posts_data = [
            {
                'title': 'Cassava Farming in Rivers State: A Complete Guide',
                'slug': 'cassava-farming-rivers-state-guide',
                'content': '''
                Cassava is one of the most important crops in Rivers State, Nigeria. This comprehensive 
                guide covers everything you need to know about successful cassava cultivation in our region.

                **Best Varieties for Rivers State:**
                1. TMS 30572 - High yielding and disease resistant
                2. TME 419 - Good for processing into garri
                3. NR 8082 - Suitable for wet season planting

                **Planting Season:**
                - Early season: March - May
                - Late season: July - September

                **Soil Requirements:**
                Rivers State's sandy-loam soils are ideal for cassava. Ensure good drainage 
                as waterlogged conditions can cause root rot.

                **Pest Management:**
                Common pests include cassava mealybug and green spider mite. Use integrated 
                pest management approaches combining biological and chemical controls.

                **Market Opportunities:**
                Port Harcourt has strong demand for cassava products. Consider value addition 
                through processing into garri, fufu, or cassava flour.
                ''',
                'excerpt': 'Complete guide to growing cassava successfully in Rivers State, Nigeria.',
                'status': 'published',
                'tags': 'cassava, rivers state, nigeria, farming, agriculture',
                'is_featured': True,
                'published_at': now - timedelta(days=1),
            },
            {
                'title': 'Fish Farming in the Niger Delta: Opportunities and Challenges',
                'slug': 'fish-farming-niger-delta',
                'content': '''
                The Niger Delta region offers excellent opportunities for aquaculture development. 
                With abundant water resources and favorable climate, fish farming can be highly profitable.

                **Popular Fish Species:**
                - Catfish (Clarias gariepinus) - Most popular and profitable
                - Tilapia - Fast growing and disease resistant
                - Carp - Good for polyculture systems

                **Pond Construction:**
                Consider the high water table in our region. Earthen ponds work well, 
                but ensure proper drainage during rainy season.

                **Feed Management:**
                Local feed ingredients include palm kernel cake, brewery waste, and 
                fish meal from local sources.

                **Market Access:**
                Port Harcourt and surrounding areas have high demand for fresh fish. 
                Consider direct sales to hotels and restaurants.
                ''',
                'excerpt': 'Explore fish farming opportunities in the Niger Delta region.',
                'status': 'published',
                'tags': 'fish farming, aquaculture, niger delta, catfish, tilapia',
                'is_featured': True,
                'published_at': now - timedelta(days=3),
            },
            {
                'title': 'Palm Oil Production: From Plantation to Processing',
                'slug': 'palm-oil-production-guide',
                'content': '''
                Palm oil is a major agricultural commodity in Rivers State. This guide covers 
                sustainable palm oil production from plantation establishment to processing.

                **Plantation Establishment:**
                - Choose improved varieties like Tenera hybrid
                - Plant spacing: 9m x 9m triangular pattern
                - Intercrop with legumes in early years

                **Harvesting:**
                Fresh fruit bunches should be harvested when 5-10 fruits have fallen naturally. 
                Process within 24 hours to maintain oil quality.

                **Processing Options:**
                - Traditional method using local mills
                - Small-scale mechanical processing
                - Cooperative processing centers

                **Environmental Considerations:**
                Practice sustainable farming to protect our Niger Delta ecosystem. 
                Proper waste management is crucial for environmental protection.
                ''',
                'excerpt': 'Comprehensive guide to sustainable palm oil production in Rivers State.',
                'status': 'published',
                'tags': 'palm oil, plantation, processing, sustainability, rivers state',
                'is_featured': False,
                'published_at': now - timedelta(days=7),
            },
            {
                'title': 'Urban Farming in Port Harcourt: Growing Food in the City',
                'slug': 'urban-farming-port-harcourt',
                'content': '''
                With increasing urbanization in Port Harcourt, urban farming presents opportunities 
                for food security and income generation within the city.

                **Suitable Crops for Urban Farming:**
                - Leafy vegetables: Spinach, lettuce, cabbage
                - Herbs: Basil, parsley, scent leaves
                - Fruits: Tomatoes, peppers, okra

                **Growing Methods:**
                - Container gardening on balconies
                - Vertical farming systems
                - Rooftop gardens
                - Backyard plots

                **Water Management:**
                Collect rainwater during wet season for dry season use. 
                Drip irrigation systems help conserve water.

                **Market Opportunities:**
                Supply fresh vegetables to local markets, restaurants, and neighbors. 
                Organic produce commands premium prices.
                ''',
                'excerpt': 'Learn how to grow food in Port Harcourt urban environment.',
                'status': 'published',
                'tags': 'urban farming, port harcourt, vegetables, container gardening',
                'is_featured': True,
                'published_at': now - timedelta(days=5),
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
        self.stdout.write('')
        self.stdout.write('🎵 NIGERIAN RADIO STATIONS ADDED:')
        self.stdout.write('✓ Garden City Radio 101.1 FM (Port Harcourt)')
        self.stdout.write('✓ Rhythm FM Port Harcourt 93.7')
        self.stdout.write('✓ Nigeria Info Port Harcourt 92.3 FM')
        self.stdout.write('✓ Love FM Port Harcourt 104.5')
        self.stdout.write('✓ Rivers State Broadcasting Corporation')
        self.stdout.write('✓ Treasure FM 98.5 (Port Harcourt)')
        self.stdout.write('✓ Cool FM Nigeria 96.9')
        self.stdout.write('✓ Wazobia FM 95.1')
        self.stdout.write('✓ Classic FM 97.3')
        self.stdout.write('✓ City FM 105.1')
        self.stdout.write('✓ Naija FM 102.7')
        self.stdout.write('✓ Radio Biafra London (Igbo)')
        self.stdout.write('✓ Bond FM 92.9')
        self.stdout.write('✓ Agric Radio Nigeria')
        self.stdout.write('')
        self.stdout.write('🌍 INTERNATIONAL STATIONS:')
        self.stdout.write('✓ BBC World Service & BBC Hausa')
        self.stdout.write('✓ Voice of America Africa')
        self.stdout.write('✓ Radio France Internationale Africa')
        self.stdout.write('✓ Farm Radio International')
        self.stdout.write('✓ Ghana Broadcasting Corporation')
        self.stdout.write('')
        self.stdout.write('📝 LOCAL CONTENT ADDED:')
        self.stdout.write('✓ Port Harcourt market reports')
        self.stdout.write('✓ Rivers State farming guides')
        self.stdout.write('✓ Niger Delta weather updates')
        self.stdout.write('✓ Cassava & fish farming articles')
        self.stdout.write('✓ Urban farming in Port Harcourt')
        self.stdout.write('')
        self.stdout.write('You can now access the admin panel at /admin/')
        self.stdout.write('Username: admin, Password: admin123')