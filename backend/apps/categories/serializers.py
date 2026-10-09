from rest_framework import serializers
from apps.categories.models import Category, CategoryAttribute

class SubcategorySerializer(serializers.ModelSerializer):
    listing_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon_identifier', 'listing_count']


class CategoryAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryAttribute
        fields = ['id', 'name', 'attribute_type', 'options', 'is_required', 'is_filterable']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    attributes = CategoryAttributeSerializer(many=True, read_only=True)
    listing_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'icon_identifier',
            'sort_order', 'is_active', 'listing_count', 'subcategories', 'attributes'
        ]

    def get_subcategories(self, obj):
        subs = obj.subcategories.filter(is_active=True).order_by('sort_order', 'name')
        return SubcategorySerializer(subs, many=True).data
