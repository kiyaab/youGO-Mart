from rest_framework import serializers
from django.utils.timesince import timesince
from apps.listings.models import Listing, ListingImage, ListingAttributeValue
from apps.categories.models import Category
from apps.sellers.models import SellerProfile

class ListingImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='url', read_only=True)

    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'image_url', 'url', 'display_order', 'is_primary']


class ListingAttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)

    class Meta:
        model = ListingAttributeValue
        fields = ['id', 'attribute_name', 'value']


class ListingCardSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    seller_name = serializers.CharField(source='seller.public_name', read_only=True)
    is_seller_verified = serializers.BooleanField(source='seller.is_verified', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'price', 'currency', 'is_negotiable',
            'condition', 'condition_display', 'category_name', 'category_slug',
            'city', 'neighborhood', 'landmark', 'status',
            'is_promoted', 'promotion_type', 'reference_id', 'views_count',
            'primary_image', 'seller_id', 'seller_name', 'is_seller_verified',
            'created_at', 'time_ago'
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        return img.url if img else None

    def get_time_ago(self, obj):
        return f"{timesince(obj.created_at).split(',')[0]} ago"


class SellerSummarySerializer(serializers.ModelSerializer):
    is_verified = serializers.BooleanField(source='is_verified', read_only=True)
    active_listings_count = serializers.SerializerMethodField()
    member_since = serializers.SerializerMethodField()

    class Meta:
        model = SellerProfile
        fields = [
            'id', 'public_name', 'business_name', 'bio', 'contact_phone',
            'allow_calls', 'allow_whatsapp', 'allow_messages', 'allow_email',
            'location_city', 'location_neighborhood', 'verification_status',
            'is_verified', 'response_time_str', 'active_listings_count', 'member_since'
        ]

    def get_active_listings_count(self, obj):
        return obj.listings.filter(status='active').count()

    def get_member_since(self, obj):
        return obj.created_at.strftime("%B %Y")


class ListingDetailSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    attribute_values = ListingAttributeValueSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    time_ago = serializers.SerializerMethodField()
    seller = SellerSummarySerializer(read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'description', 'price', 'currency',
            'is_negotiable', 'condition', 'condition_display', 'brand', 'model',
            'category', 'category_name', 'category_slug', 'subcategory',
            'country', 'region', 'city', 'neighborhood', 'landmark',
            'status', 'is_promoted', 'promotion_type', 'reference_id',
            'views_count', 'contact_clicks_count', 'images', 'attribute_values',
            'seller', 'is_favorited', 'created_at', 'updated_at', 'time_ago'
        ]

    def get_time_ago(self, obj):
        return f"{timesince(obj.created_at).split(',')[0]} ago"

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class ListingCreateSerializer(serializers.ModelSerializer):
    image_urls = serializers.ListField(
        child=serializers.URLField(), required=False, write_only=True
    )
    category_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'category_id', 'description', 'price', 'currency',
            'is_negotiable', 'condition', 'brand', 'model',
            'country', 'region', 'city', 'neighborhood', 'landmark',
            'image_urls', 'status', 'slug', 'reference_id'
        ]
        read_only_fields = ['id', 'status', 'slug', 'reference_id']

    def create(self, validated_data):
        image_urls = validated_data.pop('image_urls', [])
        category_id = validated_data.pop('category_id')
        category = Category.objects.get(id=category_id)
        
        request = self.context.get('request')
        seller, _ = SellerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'public_name': request.user.profile.display_name if hasattr(request.user, 'profile') else request.user.username,
                'contact_phone': request.user.phone or '+251911000000',
                'location_city': validated_data.get('city', 'Addis Ababa'),
                'location_neighborhood': validated_data.get('neighborhood', 'Bole'),
            }
        )

        listing = Listing.objects.create(
            seller=seller,
            category=category,
            status='active', # Default to active for immediate discovery, admin can moderate
            **validated_data
        )

        # Create images
        for idx, url in enumerate(image_urls):
            ListingImage.objects.create(
                listing=listing,
                image_url=url,
                display_order=idx,
                is_primary=(idx == 0)
            )

        return listing
