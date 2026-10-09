import uuid
from django.db import models
from django.conf import settings
from apps.listings.models import Listing
from apps.sellers.models import SellerProfile

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.email}"

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'listing')

    def __str__(self):
        return f"{self.quantity}x {self.listing.title}"

    @property
    def subtotal(self):
        return self.listing.price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_METHODS = [
        ('telebirr', 'Telebirr (Ethiopian Mobile Money)'),
        ('cbe_birr', 'CBE Birr / Commercial Bank of Ethiopia'),
        ('bank_transfer', 'Direct Bank Transfer'),
        ('cash_on_delivery', 'Cash on Delivery / In-Person Inspection'),
    ]

    PAYMENT_STATUS = [
        ('pending', 'Pending Verification'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    ]

    order_number = models.CharField(max_length=32, unique=True, db_index=True)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='ETB')
    status = models.CharField(max_length=24, choices=STATUS_CHOICES, default='pending')

    shipping_name = models.CharField(max_length=120)
    shipping_phone = models.CharField(max_length=32)
    shipping_city = models.CharField(max_length=100, default='Addis Ababa')
    shipping_address = models.CharField(max_length=255)

    payment_method = models.CharField(max_length=32, choices=PAYMENT_METHODS, default='telebirr')
    payment_status = models.CharField(max_length=24, choices=PAYMENT_STATUS, default='pending')
    tracking_number = models.CharField(max_length=64, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"YGM-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.order_number} - {self.buyer.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    seller = models.ForeignKey(SellerProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    listing = models.ForeignKey(Listing, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_title = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    fulfillment_status = models.CharField(max_length=24, choices=Order.STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.quantity}x {self.product_title} in #{self.order.order_number}"
