from rest_framework import serializers
from apps.favorites.models import Favorite, SavedSearch
from apps.listings.serializers import ListingCardSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    listing = ListingCardSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'listing', 'created_at']


class SavedSearchSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = SavedSearch
        fields = [
            'id', 'title', 'query', 'category', 'category_name',
            'min_price', 'max_price', 'location', 'notify_new_matches', 'created_at'
        ]
