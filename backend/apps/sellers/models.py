from django.db import models
from django.conf import settings

class SellerProfile(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]
    VERIFICATION_CHOICES = [
        ('unverified', 'Unverified'),
        ('pending', 'Verification Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Verification Rejected'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seller_profile')
    public_name = models.CharField(max_length=120)
    business_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True, max_length=1000)
    contact_phone = models.CharField(max_length=30)
    allow_calls = models.BooleanField(default=True, help_text="Show phone call button")
    allow_whatsapp = models.BooleanField(default=True, help_text="Show WhatsApp chat link")
    allow_messages = models.BooleanField(default=True, help_text="Accept in-platform messages")
    allow_email = models.BooleanField(default=False, help_text="Allow direct email inquiry")
    location_city = models.CharField(max_length=100, default='Addis Ababa')
    location_neighborhood = models.CharField(max_length=100, blank=True, default='Bole')
    seller_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='unverified')
    total_views = models.PositiveIntegerField(default=0)
    total_contact_clicks = models.PositiveIntegerField(default=0)
    response_time_str = models.CharField(max_length=50, default='Typically replies in 1 hour')
    verified_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_verified(self):
        return self.verification_status == 'verified'

    def __str__(self):
        return f"{self.public_name} ({self.get_verification_status_display()})"


class SellerVerification(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    DOC_CHOICES = [
        ('national_id', 'Ethiopian Kebele/National ID'),
        ('business_license', 'Commercial Registration / Business License'),
        ('passport', 'Passport / Resident ID'),
    ]

    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='verification_requests')
    document_type = models.CharField(max_length=30, choices=DOC_CHOICES, default='national_id')
    document_number = models.CharField(max_length=100, blank=True)
    document_file = models.FileField(upload_to='private/verifications/', blank=True, null=True)
    seller_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_verifications')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Verification for {self.seller.public_name} [{self.status}]"
