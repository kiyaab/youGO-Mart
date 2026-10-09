from rest_framework import serializers
from apps.messaging.models import Conversation, ConversationParticipant, Message
from apps.listings.models import Listing

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_name', 'content', 'is_read', 'is_me', 'created_at']
        read_only_fields = ['id', 'conversation', 'sender', 'is_read', 'created_at']

    def get_sender_name(self, obj):
        if hasattr(obj.sender, 'profile') and obj.sender.profile.display_name:
            return obj.sender.profile.display_name
        return obj.sender.username or obj.sender.email.split('@')[0]

    def get_is_me(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender_id == request.user.id
        return False


class ConversationSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_price = serializers.DecimalField(source='listing.price', max_digits=12, decimal_places=2, read_only=True)
    listing_currency = serializers.CharField(source='listing.currency', read_only=True)
    listing_image = serializers.SerializerMethodField()
    other_party = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'listing', 'listing_title', 'listing_price', 'listing_currency',
            'listing_image', 'other_party', 'last_message', 'unread_count', 'updated_at'
        ]

    def get_listing_image(self, obj):
        if obj.listing:
            img = obj.listing.images.first()
            return img.url if img else None
        return None

    def get_other_party(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        other_part = obj.participants.exclude(user=request.user).first()
        if other_part:
            u = other_part.user
            name = u.profile.display_name if hasattr(u, 'profile') and u.profile.display_name else u.username
            return {'id': u.id, 'name': name, 'email': u.email}
        return {'id': None, 'name': 'Marketplace User', 'email': ''}

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content,
                'created_at': last_msg.created_at,
                'is_read': last_msg.is_read,
                'sender_id': last_msg.sender_id
            }
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
