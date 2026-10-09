from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.listings.models import Listing
from apps.categories.models import Category
from apps.sellers.models import SellerProfile
from apps.orders.models import Cart, CartItem, Order, OrderItem

User = get_user_model()

class OrdersCartTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Buyer
        self.buyer = User.objects.create_user(
            username='testbuyer',
            email='buyer@yougomart.et',
            password='Password123!',
            role='buyer'
        )

        # Create Seller
        self.seller_user = User.objects.create_user(
            username='testseller',
            email='seller@yougomart.et',
            password='Password123!',
            role='seller'
        )
        self.seller_profile = SellerProfile.objects.create(
            user=self.seller_user,
            public_name='Addis Tech Store',
            business_name='Addis Tech Store PLC',
            contact_phone='+251 911 223344',
            location_city='Addis Ababa',
            verification_status='verified'
        )

        # Create Category & Listing
        self.category = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )

        self.listing = Listing.objects.create(
            seller=self.seller_profile,
            category=self.category,
            title='Wireless Noise Cancelling Headphones',
            slug='wireless-headphones-test',
            description='Authentic high quality audio headphones.',
            price=4500.00,
            currency='ETB',
            status='active'
        )

    def test_unauthenticated_cart_access_denied(self):
        response = self.client.get('/api/v1/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_buyer_cart_flow(self):
        self.client.force_authenticate(user=self.buyer)

        # 1. Fetch initially empty cart
        res = self.client.get('/api/v1/cart/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['items']), 0)
        self.assertEqual(float(res.data['total_amount']), 0.0)

        # 2. Add listing to cart
        add_res = self.client.post('/api/v1/cart/', {
            'listing_id': self.listing.id,
            'quantity': 2
        })
        self.assertEqual(add_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(add_res.data['items']), 1)
        self.assertEqual(float(add_res.data['total_amount']), 9000.0)

        # 3. Update quantity
        item_id = add_res.data['items'][0]['id']
        upd_res = self.client.patch(f'/api/v1/cart/items/{item_id}/', {
            'quantity': 3
        })
        self.assertEqual(upd_res.status_code, status.HTTP_200_OK)
        self.assertEqual(float(upd_res.data['total_amount']), 13500.0)

        # 4. Checkout order
        checkout_res = self.client.post('/api/v1/orders/checkout/', {
            'shipping_name': 'Abebe Bikila',
            'shipping_phone': '+251 912 345678',
            'shipping_city': 'Addis Ababa',
            'shipping_address': 'Bole Subcity, Woreda 03',
            'payment_method': 'telebirr'
        })
        self.assertEqual(checkout_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue('order_number' in checkout_res.data)
        self.assertEqual(float(checkout_res.data['total_amount']), 13500.0)
        self.assertEqual(checkout_res.data['status'], 'confirmed')

        # 5. Cart should now be empty after checkout
        cart_res = self.client.get('/api/v1/cart/')
        self.assertEqual(len(cart_res.data['items']), 0)

        # 6. Buyer can view their orders
        orders_res = self.client.get('/api/v1/orders/')
        self.assertEqual(orders_res.status_code, status.HTTP_200_OK)
        orders_list = orders_res.data.get('results', orders_res.data) if isinstance(orders_res.data, dict) else orders_res.data
        self.assertEqual(len(orders_list), 1)

    def test_seller_order_items_visibility(self):
        # Create an order directly
        order = Order.objects.create(
            buyer=self.buyer,
            total_amount=4500.00,
            shipping_name='Buyer Name',
            shipping_phone='+251 900 000000',
            shipping_city='Addis Ababa',
            shipping_address='Piazza',
            payment_method='telebirr'
        )
        item = OrderItem.objects.create(
            order=order,
            seller=self.seller_profile,
            listing=self.listing,
            product_title=self.listing.title,
            unit_price=self.listing.price,
            quantity=1,
            subtotal=self.listing.price
        )

        # Buyer can't access seller endpoint
        self.client.force_authenticate(user=self.buyer)
        buyer_seller_res = self.client.get('/api/v1/orders/seller/')
        self.assertEqual(buyer_seller_res.status_code, status.HTTP_403_FORBIDDEN)

        # Seller can access their seller order items
        self.client.force_authenticate(user=self.seller_user)
        seller_res = self.client.get('/api/v1/orders/seller/')
        self.assertEqual(seller_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(seller_res.data), 1)
        self.assertEqual(seller_res.data[0]['product_title'], self.listing.title)
