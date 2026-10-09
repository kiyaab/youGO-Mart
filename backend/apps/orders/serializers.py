from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from apps.listings.serializers import ListingCardSerializer

class CartItemSerializer(serializers.ModelSerializer):
    listing = ListingCardSerializer(read_only=True)
    listing_id = serializers.IntegerField(write_only=True)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'listing', 'listing_id', 'quantity', 'unit_price', 'subtotal', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_amount', 'total_items', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.public_name', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'listing', 'seller', 'seller_name', 'product_title',
            'unit_price', 'quantity', 'subtotal',
            'fulfillment_status'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer', 'buyer_email', 'status',
            'total_amount', 'currency', 'shipping_name', 'shipping_phone',
            'shipping_city', 'shipping_address', 'payment_method',
            'payment_status', 'tracking_number', 'notes',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'buyer', 'tracking_number', 'total_amount', 'currency', 'status']


class CheckoutSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=120)
    shipping_phone = serializers.CharField(max_length=32)
    shipping_city = serializers.CharField(max_length=100, default='Addis Ababa')
    shipping_address = serializers.CharField(max_length=255)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES, default='telebirr')
    notes = serializers.CharField(required=False, allow_blank=True)
