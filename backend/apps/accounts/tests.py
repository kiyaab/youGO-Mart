from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework import status
import io

User = get_user_model()

class AccountsAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_google_auth_buyer_registration(self):
        response = self.client.post('/api/v1/auth/google/', {
            'email': 'newbuyer@gmail.com',
            'name': 'Dawit Tsige',
            'role': 'buyer',
            'city': 'Addis Ababa'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)
        self.assertEqual(response.data['user']['email'], 'newbuyer@gmail.com')
        self.assertEqual(response.data['user']['role'], 'buyer')

        # Verify DB
        user = User.objects.get(email='newbuyer@gmail.com')
        self.assertEqual(user.role, 'buyer')

    def test_google_auth_seller_registration(self):
        response = self.client.post('/api/v1/auth/google/', {
            'email': 'newseller@gmail.com',
            'name': 'Selamawit Kebede',
            'role': 'seller',
            'store_name': 'Selam Fashion Boutique',
            'phone': '+251 922 334455',
            'city': 'Hawassa'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(email='newseller@gmail.com')
        self.assertEqual(user.role, 'seller')
        self.assertTrue(hasattr(user, 'seller_profile'))
        self.assertEqual(user.seller_profile.business_name, 'Selam Fashion Boutique')
        self.assertEqual(user.seller_profile.verification_status, 'pending')

    def test_google_auth_cannot_claim_admin(self):
        # Malicious attempt to register as admin via Google Auth endpoint
        response = self.client.post('/api/v1/auth/google/', {
            'email': 'hacker@gmail.com',
            'name': 'Malicious User',
            'role': 'admin'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(email='hacker@gmail.com')
        # Role must be sanitized to buyer!
        self.assertEqual(user.role, 'buyer')
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)

    def test_bootstrap_admin_command(self):
        out = io.StringIO()
        call_command(
            'bootstrap_admin',
            email='leadadmin@yougomart.et',
            password='SecureAdminPassword2026!',
            username='leadadmin',
            stdout=out
        )
        self.assertIn('successfully', out.getvalue().lower())

        admin = User.objects.get(email='leadadmin@yougomart.et')
        self.assertEqual(admin.role, 'admin')
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
