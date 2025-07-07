from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, RadioStation, UserProfile, Event, BlogPost


class RadioStationModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Test Category",
            description="Test Description"
        )
        self.station = RadioStation.objects.create(
            name="Test Station",
            description="Test Description",
            stream_url="https://example.com/stream",
            category=self.category,
            country="Test Country",
            language="English"
        )

    def test_station_creation(self):
        self.assertEqual(self.station.name, "Test Station")
        self.assertEqual(self.station.category, self.category)
        self.assertTrue(self.station.is_active)
        self.assertEqual(self.station.listeners_count, 0)

    def test_station_str_method(self):
        self.assertEqual(str(self.station), "Test Station")


class RadioStationAPITest(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Test Category",
            description="Test Description"
        )
        self.station = RadioStation.objects.create(
            name="Test Station",
            description="Test Description",
            stream_url="https://example.com/stream",
            category=self.category,
            country="Test Country",
            language="English"
        )
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

    def test_get_stations_list(self):
        url = reverse('radiostation-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_station_detail(self):
        url = reverse('radiostation-detail', kwargs={'pk': self.station.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Station')

    def test_toggle_favorite_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('radiostation-toggle-favorite', kwargs={'pk': self.station.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_favorited'])

    def test_toggle_favorite_unauthenticated(self):
        url = reverse('radiostation-toggle-favorite', kwargs={'pk': self.station.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EventModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        self.station = RadioStation.objects.create(
            name="Test Station",
            stream_url="https://example.com/stream",
            category=self.category,
            country="Test Country",
            language="English"
        )
        self.event = Event.objects.create(
            title="Test Event",
            description="Test Description",
            station=self.station,
            start_time="2024-12-31 10:00:00+00:00",
            end_time="2024-12-31 12:00:00+00:00"
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, "Test Event")
        self.assertEqual(self.event.station, self.station)

    def test_event_str_method(self):
        expected = f"Test Event - {self.station.name}"
        self.assertEqual(str(self.event), expected)


class BlogPostModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.post = BlogPost.objects.create(
            title="Test Post",
            slug="test-post",
            content="Test content",
            author=self.user,
            status='published'
        )

    def test_post_creation(self):
        self.assertEqual(self.post.title, "Test Post")
        self.assertEqual(self.post.author, self.user)
        self.assertEqual(self.post.status, 'published')

    def test_post_str_method(self):
        self.assertEqual(str(self.post), "Test Post")