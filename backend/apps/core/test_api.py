from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.categories.models import Category
from apps.sellers.models import SellerProfile
from apps.listings.models import Listing

class YouGoMartAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@yougomart.et',
            username='testuser',
            password='Password123!',
            role='seller'
        )
        self.seller = SellerProfile.objects.create(
            user=self.user,
            public_name='Test Electronics',
            contact_phone='+251911112233',
            verification_status='verified'
        )
        self.category = Category.objects.create(
            name='Phones and Electronics',
            slug='phones-and-electronics'
        )
        self.listing = Listing.objects.create(
            seller=self.seller,
            category=self.category,
            title='Samsung Galaxy S23 128GB',
            description='Good condition test listing in Addis',
            price=45000,
            currency='ETB',
            condition='used_good',
            city='Addis Ababa',
            neighborhood='Bole',
            status='active'
        )

    def test_get_categories(self):
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_listings(self):
        response = self.client.get('/api/v1/listings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Samsung Galaxy S23 128GB')

    def test_search_listings(self):
        response = self.client.get('/api/v1/listings/?q=Samsung')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

        response2 = self.client.get('/api/v1/listings/?q=NonExistentGadget')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['count'], 0)

    def test_user_login(self):
        response = self.client.post('/api/v1/auth/login/', {
            'email': 'testuser@yougomart.et',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_favorite_toggle(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/v1/listings/{self.listing.id}/favorite/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_favorited'])

        response2 = self.client.post(f'/api/v1/listings/{self.listing.id}/favorite/')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertFalse(response2.data['is_favorited'])
