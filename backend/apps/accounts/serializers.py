from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from apps.accounts.models import User
from apps.profiles.models import UserProfile
from apps.sellers.models import SellerProfile

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    has_seller_profile = serializers.SerializerMethodField()
    is_seller_verified = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role', 'is_verified', 'display_name', 'has_seller_profile', 'is_seller_verified', 'created_at']

    def get_display_name(self, obj):
        if hasattr(obj, 'profile') and obj.profile.display_name:
            return obj.profile.display_name
        return obj.username or obj.email.split('@')[0]

    def get_has_seller_profile(self, obj):
        return hasattr(obj, 'seller_profile')

    def get_is_seller_verified(self, obj):
        if hasattr(obj, 'seller_profile'):
            return obj.seller_profile.is_verified()
        return False


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    display_name = serializers.CharField(required=False, allow_blank=True)
    is_seller = serializers.BooleanField(default=False)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'phone', 'display_name', 'is_seller']

    def create(self, validated_data):
        display_name = validated_data.pop('display_name', '')
        is_seller = validated_data.pop('is_seller', False)
        password = validated_data.pop('password')
        
        email = validated_data.get('email')
        username = validated_data.get('username') or email.split('@')[0]
        validated_data['username'] = username
        
        role = 'seller' if is_seller else 'buyer'
        user = User.objects.create_user(role=role, **validated_data)
        user.set_password(password)
        user.save()

        # Create Profile
        UserProfile.objects.create(
            user=user,
            display_name=display_name or username,
            country="Ethiopia",
            city="Addis Ababa"
        )

        # Create SellerProfile if requested
        if is_seller:
            SellerProfile.objects.create(
                user=user,
                public_name=display_name or username,
                contact_phone=user.phone or "+251911000000",
                location_city="Addis Ababa",
                location_neighborhood="Bole"
            )

        Token.objects.get_or_create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        user = authenticate(username=user_obj.email, password=password)
        if not user:
            user = authenticate(username=user_obj.username, password=password)
        if not user and user_obj.check_password(password):
            user = user_obj

        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is suspended.")
        data['user'] = user
        return data
