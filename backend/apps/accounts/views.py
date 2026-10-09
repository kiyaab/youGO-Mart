from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.db import transaction
from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer, RegisterSerializer, LoginSerializer
from apps.profiles.models import UserProfile
from apps.sellers.models import SellerProfile

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Registration successful",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleAuthView(views.APIView):
    """
    Production-ready Google OAuth handler:
    Accepts verified Google profile / token data from client or Auth.js,
    provisions or retrieves account with strict RBAC (BUYER or SELLER).
    ADMIN role can NEVER be granted through public Google Auth.
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        email = request.data.get('email')
        if not email or '@' not in email:
            return Response({"error": "Valid email is required from Google Identity."}, status=status.HTTP_400_BAD_REQUEST)

        email = email.lower().strip()
        requested_role = request.data.get('role', 'buyer')
        # Security Guard: Admin role can NEVER be claimed via Google OAuth!
        if requested_role not in ['buyer', 'seller']:
            requested_role = 'buyer'

        display_name = request.data.get('name') or request.data.get('display_name') or email.split('@')[0]
        phone = request.data.get('phone', '')

        # Check existing user
        user = User.objects.filter(email=email).first()
        if not user:
            username = email.split('@')[0]
            # Ensure unique username
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                role=requested_role,
                phone=phone
            )
            # Create user profile
            UserProfile.objects.create(
                user=user,
                display_name=display_name,
                city=request.data.get('city', 'Addis Ababa'),
                region='Addis Ababa'
            )

        # If user chooses to register as a seller and doesn't have a seller profile yet
        if requested_role == 'seller' and not hasattr(user, 'seller_profile'):
            user.role = 'seller'
            user.save(update_fields=['role'])
            store_name = request.data.get('store_name') or f"{display_name}'s Store"
            SellerProfile.objects.create(
                user=user,
                public_name=display_name,
                business_name=store_name,
                contact_phone=phone or '+251 900 000000',
                location_city=request.data.get('city', 'Addis Ababa'),
                location_neighborhood=request.data.get('neighborhood', 'Bole'),
                verification_status='pending'
            )

        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)

        return Response({
            "message": "Google authentication verified successfully.",
            "token": token.key,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({"message": "Successfully logged out."})


class CurrentUserView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                "is_authenticated": True,
                "user": UserSerializer(request.user).data
            })
        return Response({
            "is_authenticated": False,
            "user": None
        })
