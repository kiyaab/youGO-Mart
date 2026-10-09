import uuid
from django.db import models
from django.utils.text import slugify
from apps.sellers.models import SellerProfile
from apps.categories.models import Category, CategoryAttribute

class Listing(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('active', 'Active'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('paused', 'Paused'),
        ('expired', 'Expired'),
        ('rejected', 'Rejected'),
        ('removed', 'Removed'),
    ]

    CONDITION_CHOICES = [
        ('brand_new', 'Brand New'),
        ('like_new', 'Like New / Open Box'),
        ('used_good', 'Used - Good Condition'),
        ('used_fair', 'Used - Fair Condition'),
        ('refurbished', 'Refurbished'),
    ]

    PROMOTION_CHOICES = [
        ('none', 'Standard Free Listing'),
        ('featured', 'Featured Spotlight'),
        ('top', 'Top Category Placement'),
        ('urgent', 'Urgent Deal'),
    ]

    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='listings')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='listings')
    subcategory = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='sub_listings')
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=230, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='ETB')
    is_negotiable = models.BooleanField(default=False)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='used_good')
    
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    
    country = models.CharField(max_length=100, default='Ethiopia')
    region = models.CharField(max_length=100, default='Addis Ababa')
    city = models.CharField(max_length=100, default='Addis Ababa')
    neighborhood = models.CharField(max_length=100, default='Bole')
    landmark = models.CharField(max_length=150, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    rejection_reason = models.TextField(blank=True)
    
    is_promoted = models.BooleanField(default=False)
    promotion_type = models.CharField(max_length=20, choices=PROMOTION_CHOICES, default='none')
    
    reference_id = models.CharField(max_length=20, unique=True, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    contact_clicks_count = models.PositiveIntegerField(default=0)
    
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_promoted', '-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['city', 'neighborhood']),
            models.Index(fields=['price']),
        ]

    def save(self, *args, **kwargs):
        if not self.reference_id:
            self.reference_id = f"YG-{uuid.uuid4().hex[:8].upper()}"
        if not self.slug:
            base_slug = slugify(self.title) or "listing"
            unique_part = self.reference_id[-6:].lower()
            self.slug = f"{base_slug}-{unique_part}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.price} {self.currency}) [{self.status}]"


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/%Y/%m/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, help_text="Direct URL fallback or external image")
    display_order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'id']

    @property
    def url(self):
        if self.image:
            return self.image.url
        return self.image_url or '/placeholder-product.png'

    def __str__(self):
        return f"Image for {self.listing.title} (#{self.display_order})"


class ListingAttributeValue(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='attribute_values')
    attribute = models.ForeignKey(CategoryAttribute, on_delete=models.CASCADE)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class ListingViewEvent(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='view_events')
    ip_hash = models.CharField(max_length=64, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class ContactClickEvent(models.Model):
    METHOD_CHOICES = [
        ('call', 'Phone Call'),
        ('whatsapp', 'WhatsApp'),
        ('message', 'Platform Message'),
        ('email', 'Email'),
    ]

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='contact_events')
    contact_method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
