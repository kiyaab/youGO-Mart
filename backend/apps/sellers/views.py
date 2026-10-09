from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.sellers.models import SellerProfile, SellerVerification
from apps.sellers.serializers import SellerProfileSerializer, PublicSellerProfileSerializer, SellerVerificationSerializer

class MySellerProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        seller, created = SellerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'public_name': request.user.profile.display_name if hasattr(request.user, 'profile') else request.user.username,
                'contact_phone': request.user.phone or '+251911000000',
                'location_city': 'Addis Ababa',
                'location_neighborhood': 'Bole',
            }
        )
        serializer = SellerProfileSerializer(seller)
        return Response(serializer.data)

    def put(self, request):
        seller, _ = SellerProfile.objects.get_or_create(user=request.user)
        serializer = SellerProfileSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicSellerProfileView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            seller = SellerProfile.objects.get(id=pk)
            serializer = PublicSellerProfileSerializer(seller)
            return Response(serializer.data)
        except SellerProfile.DoesNotExist:
            return Response({"error": "Seller profile not found"}, status=status.HTTP_404_NOT_FOUND)


class SellerVerificationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        seller, _ = SellerProfile.objects.get_or_create(user=request.user)
        
        # Check if already pending or verified
        if seller.verification_status == 'verified':
            return Response({"message": "You are already verified!"}, status=status.HTTP_200_OK)
        
        serializer = SellerVerificationSerializer(data=request.data)
        if serializer.is_valid():
            verification = serializer.save(seller=seller)
            seller.verification_status = 'pending'
            seller.save()
            return Response({
                "message": "Verification request submitted successfully. Our team will review your credentials.",
                "verification": SellerVerificationSerializer(verification).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SellerAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        seller, _ = SellerProfile.objects.get_or_create(user=request.user)
        listings = seller.listings.all()
        
        total_views = sum(l.views_count for l in listings)
        total_clicks = sum(l.contact_clicks_count for l in listings)
        
        status_counts = {
            'active': listings.filter(status='active').count(),
            'pending': listings.filter(status='pending').count(),
            'reserved': listings.filter(status='reserved').count(),
            'sold': listings.filter(status='sold').count(),
            'paused': listings.filter(status='paused').count(),
            'total': listings.count()
        }

        # Per listing metrics
        listing_metrics = [
            {
                'id': l.id,
                'title': l.title,
                'status': l.status,
                'views': l.views_count,
                'contact_clicks': l.contact_clicks_count,
                'price': str(l.price),
                'currency': l.currency,
                'created_at': l.created_at.strftime('%Y-%m-%d')
            } for l in listings[:10]
        ]

        return Response({
            'overview': {
                'total_views': total_views,
                'total_contact_clicks': total_clicks,
                'unread_messages': 0, # calculated from messaging
                'conversion_rate': f"{(total_clicks / total_views * 100):.1f}%" if total_views > 0 else "0.0%",
            },
            'status_counts': status_counts,
            'recent_listings': listing_metrics
        })
