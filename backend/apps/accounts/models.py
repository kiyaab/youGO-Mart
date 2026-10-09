from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('visitor', 'Visitor'),
        ('buyer', 'Registered Buyer'),
        ('seller', 'Seller'),
        ('verified_seller', 'Verified Seller'),
        ('moderator', 'Moderator'),
        ('admin', 'Administrator'),
    ]

    email = models.EmailField(unique=True, verbose_name="Email Address")
    phone = models.CharField(max_length=30, blank=True, null=True, verbose_name="Phone Number")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
