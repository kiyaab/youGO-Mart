from django.db import models
from apps.listings.models import Listing

class Promotion(models.Model):
    TYPE_CHOICES = [
        ('featured', 'Featured Spotlight'),
        ('top_category', 'Top of Category'),
        ('urgent', 'Urgent Deal Badge'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='promotions')
    promotion_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='featured')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_promotion_type_display()} for {self.listing.title} ({self.status})"
