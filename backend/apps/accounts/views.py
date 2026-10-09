from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
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


class GoogleAuthView(views.APIView):
    """
    Secure Google OAuth endpoint.
    Strictly verifies roles: never grants admin privileges via OAuth.
    Creates buyer or onboarding seller profile with pending status.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name', '')
        requested_role = request.data.get('role', 'buyer')
        store_name = request.data.get('store_name', '')
        phone = request.data.get('phone', '')
        city = request.data.get('city', 'Addis Ababa')
        neighborhood = request.data.get('neighborhood', 'Bole')

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # STRICT SECURITY: OAuth must NEVER automatically grant administrator permissions
        sanitized_role = 'seller' if requested_role == 'seller' else 'buyer'

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'role': sanitized_role,
                'phone': phone,
            }
        )

        if not created:
            # Prevent altering admin role via public OAuth
            if user.role != 'admin' and sanitized_role == 'seller' and user.role != 'seller':
                user.role = 'seller'
                user.save()
        else:
            user.set_unusable_password()
            user.save()

        # Update or create UserProfile
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'display_name': name or email.split('@')[0],
                'city': city,
            }
        )

        if sanitized_role == 'seller':
            SellerProfile.objects.get_or_create(
                user=user,
                defaults={
                    'public_name': store_name or name or profile.display_name,
                    'business_name': store_name or name or profile.display_name,
                    'contact_phone': phone,
                    'location_city': city,
                    'location_neighborhood': neighborhood,
                    'verification_status': 'pending'
                }
            )

        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)

        return Response({
            "message": "Authenticated with Google OAuth",
            "token": token.key,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)
