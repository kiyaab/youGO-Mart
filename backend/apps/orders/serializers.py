from rest_framework import serializers
from apps.orders.models import Cart, CartItem, Order, OrderItem
from apps.listings.models import Listing

class CartItemSerializer(serializers.ModelSerializer):
    listing_id = serializers.IntegerField(source='listing.id')
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_price = serializers.DecimalField(source='listing.price', max_digits=12, decimal_places=2, read_only=True)
    listing_currency = serializers.CharField(source='listing.currency', read_only=True)
    listing_image = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'listing_id', 'listing_title', 'listing_price',
            'listing_currency', 'listing_image', 'quantity', 'subtotal'
        ]

    def get_listing_image(self, obj):
        prim = obj.listing.images.filter(is_primary=True).first() or obj.listing.images.first()
        return prim.image_url if prim else ''


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.public_name', read_only=True, default='')

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_title', 'unit_price', 'quantity', 'subtotal',
            'fulfillment_status', 'listing_id', 'seller_id', 'seller_name'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_email = serializers.EmailField(source='buyer.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer_email', 'total_amount', 'currency',
            'status', 'shipping_name', 'shipping_phone', 'shipping_city',
            'shipping_address', 'payment_method', 'payment_status',
            'tracking_number', 'notes', 'created_at', 'updated_at', 'items'
        ]


class CheckoutSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=120)
    shipping_phone = serializers.CharField(max_length=32)
    shipping_city = serializers.CharField(max_length=100, default='Addis Ababa')
    shipping_address = serializers.CharField(max_length=255)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHODS, default='telebirr')
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    direct_listing_id = serializers.IntegerField(required=False, allow_null=True)
    direct_quantity = serializers.IntegerField(required=False, default=1)
