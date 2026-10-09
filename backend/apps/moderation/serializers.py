from rest_framework import serializers
from apps.moderation.models import ListingReport, UserReport, AuditLog
from apps.listings.models import Listing
from apps.sellers.models import SellerVerification
from apps.accounts.models import User

class ListingReportSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_id = serializers.IntegerField(source='listing.id', read_only=True)
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = ListingReport
        fields = [
            'id', 'listing_id', 'listing_title', 'reporter_name', 'reporter_email',
            'reason', 'description', 'status', 'moderator_notes', 'created_at'
        ]

    def get_reporter_name(self, obj):
        if obj.reporter:
            return obj.reporter.email
        return obj.reporter_email or "Anonymous"


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source='actor.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'actor_email', 'action', 'target_type', 'target_id', 'details', 'timestamp']
