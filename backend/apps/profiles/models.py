from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('am', 'Amharic (አማርኛ)'),
        ('om', 'Afaan Oromoo'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True, max_length=500)
    country = models.CharField(max_length=100, default='Ethiopia')
    region = models.CharField(max_length=100, blank=True, default='Addis Ababa')
    city = models.CharField(max_length=100, default='Addis Ababa')
    preferred_language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    email_notifications = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.display_name or self.user.username}"
