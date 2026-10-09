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


class DemoSwitchView(views.APIView):
    """
    Convenient helper for reviewing all persona flows:
    - 'buyer': Abebe Bikila (Normal Buyer)
    - 'seller': Tigist Mengistu (Verified Seller with active listings)
    - 'admin': Endegena Abebe (Marketplace Founder & Administrator)
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        role_type = request.data.get('role', 'seller')
        email_map = {
            'buyer': 'buyer@yougomart.et',
            'seller': 'tigist@yougomart.et',
            'admin': 'endegena@yougomart.et',
        }
        target_email = email_map.get(role_type, 'tigist@yougomart.et')
        try:
            user = User.objects.get(email=target_email)
        except User.DoesNotExist:
            return Response({"error": f"Demo user for role '{role_type}' not found. Please run seed command."}, status=404)

        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({
            "message": f"Switched to demo persona: {user.email}",
            "token": token.key,
            "user": UserSerializer(user).data
        })
