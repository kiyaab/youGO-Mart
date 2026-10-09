from rest_framework import serializers
from apps.profiles.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'phone', 'role', 'display_name',
            'bio', 'country', 'region', 'city', 'preferred_language',
            'email_notifications', 'message_notifications', 'created_at'
        ]
