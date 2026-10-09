from django.db import models
from django.conf import settings
from apps.listings.models import Listing

class ListingReport(models.Model):
    REASON_CHOICES = [
        ('scam', 'Suspicious Scam or Fraud'),
        ('counterfeit', 'Counterfeit or Fake Goods'),
        ('prohibited', 'Prohibited or Illegal Item'),
        ('misleading', 'Misleading Price or Description'),
        ('duplicate', 'Spam or Duplicate Listing'),
        ('inappropriate', 'Inappropriate or Offensive Content'),
        ('other', 'Other Reason'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('investigating', 'Under Investigation'),
        ('resolved', 'Resolved / Action Taken'),
        ('dismissed', 'Dismissed / No Violation'),
    ]

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reports')
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_submitted')
    reporter_email = models.CharField(max_length=120, blank=True)
    reason = models.CharField(max_length=30, choices=REASON_CHOICES, default='scam')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    moderator_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_moderated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report #{self.id} on {self.listing.title} [{self.status}]"


class UserReport(models.Model):
    REASON_CHOICES = [
        ('scam', 'Fraud / Scam Attempt'),
        ('harassment', 'Harassment or Offensive Messages'),
        ('fake_account', 'Impersonation or Fake Account'),
        ('other', 'Other Violation'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]

    reported_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_received')
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_reports_made')
    reason = models.CharField(max_length=30, choices=REASON_CHOICES, default='scam')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User Report on {self.reported_user.email}"


class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=50)
    target_id = models.CharField(max_length=50)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {self.action} on {self.target_type}:{self.target_id}"
