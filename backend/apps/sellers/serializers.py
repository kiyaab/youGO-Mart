from rest_framework import serializers
from apps.sellers.models import SellerProfile, SellerVerification

class SellerProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    is_verified = serializers.BooleanField(source='is_verified', read_only=True)
    active_listings_count = serializers.SerializerMethodField()

    class Meta:
        model = SellerProfile
        fields = [
            'id', 'user_id', 'user_email', 'public_name', 'business_name',
            'bio', 'contact_phone', 'allow_calls', 'allow_whatsapp',
            'allow_messages', 'allow_email', 'location_city',
            'location_neighborhood', 'seller_status', 'verification_status',
            'is_verified', 'total_views', 'total_contact_clicks',
            'response_time_str', 'verified_at', 'active_listings_count', 'created_at'
        ]

    def get_active_listings_count(self, obj):
        return obj.listings.filter(status='active').count()


class PublicSellerProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    is_verified = serializers.BooleanField(source='is_verified', read_only=True)
    active_listings_count = serializers.SerializerMethodField()

    class Meta:
        model = SellerProfile
        fields = [
            'id', 'user_id', 'public_name', 'business_name', 'bio',
            'allow_calls', 'allow_whatsapp', 'allow_messages', 'allow_email',
            'location_city', 'location_neighborhood', 'verification_status',
            'is_verified', 'response_time_str', 'active_listings_count', 'created_at'
        ]

    def get_active_listings_count(self, obj):
        return obj.listings.filter(status='active').count()


class SellerVerificationSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.public_name', read_only=True)

    class Meta:
        model = SellerVerification
        fields = [
            'id', 'seller', 'seller_name', 'document_type', 'document_number',
            'seller_notes', 'status', 'rejection_reason', 'reviewed_at', 'created_at'
        ]
        read_only_fields = ['seller', 'status', 'rejection_reason', 'reviewed_at', 'created_at']
