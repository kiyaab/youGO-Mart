from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from apps.listings.models import Listing, ListingImage, ContactClickEvent
from apps.listings.serializers import (
    ListingCardSerializer,
    ListingDetailSerializer,
    ListingCreateSerializer
)
from apps.favorites.models import Favorite
from apps.moderation.models import ListingReport

class ListingListCreateView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        queryset = Listing.objects.filter(status='active').select_related('seller', 'category').prefetch_related('images')

        # Keyword search
        q = request.query_params.get('q', '').strip()
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(description__icontains=q) |
                Q(brand__icontains=q) |
                Q(model__icontains=q) |
                Q(neighborhood__icontains=q) |
                Q(city__icontains=q)
            )

        # Category filter
        category_slug = request.query_params.get('category', '').strip()
        if category_slug:
            queryset = queryset.filter(
                Q(category__slug=category_slug) | Q(subcategory__slug=category_slug)
            )

        # Location filters
        city = request.query_params.get('city', '').strip()
        if city:
            queryset = queryset.filter(city__iexact=city)

        neighborhood = request.query_params.get('neighborhood', '').strip()
        if neighborhood:
            queryset = queryset.filter(neighborhood__iexact=neighborhood)

        # Price range
        min_price = request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Condition
        condition = request.query_params.get('condition')
        if condition:
            queryset = queryset.filter(condition=condition)

        # Negotiable
        negotiable = request.query_params.get('negotiable')
        if negotiable in ('true', '1', 'True'):
            queryset = queryset.filter(is_negotiable=True)

        # Verified seller only
        verified_only = request.query_params.get('verified_only')
        if verified_only in ('true', '1', 'True'):
            queryset = queryset.filter(seller__verification_status='verified')

        # Sorting
        sort = request.query_params.get('sort', 'newest')
        if sort == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort == 'popular':
            queryset = queryset.order_by('-views_count', '-created_at')
        else: # newest
            queryset = queryset.order_by('-is_promoted', '-created_at')

        # Pagination limit
        limit = int(request.query_params.get('limit', 24))
        offset = int(request.query_params.get('offset', 0))
        total_count = queryset.count()
        results = queryset[offset:offset+limit]

        serializer = ListingCardSerializer(results, many=True, context={'request': request})
        return Response({
            'count': total_count,
            'limit': limit,
            'offset': offset,
            'results': serializer.data
        })

    def post(self, request):
        serializer = ListingCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            listing = serializer.save()
            return Response(
                ListingDetailSerializer(listing, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListingDetailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, identifier):
        if identifier.isdigit():
            return Listing.objects.filter(id=int(identifier)).first()
        return Listing.objects.filter(slug=identifier).first()

    def get(self, request, identifier):
        listing = self.get_object(identifier)
        if not listing:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        # Increment view count
        listing.views_count += 1
        listing.save(update_fields=['views_count'])

        # Increment seller total views
        if hasattr(listing, 'seller'):
            listing.seller.total_views += 1
            listing.seller.save(update_fields=['total_views'])

        serializer = ListingDetailSerializer(listing, context={'request': request})
        return Response(serializer.data)

    def put(self, request, identifier):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        listing = self.get_object(identifier)
        if not listing:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)
        if listing.seller.user != request.user and not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ListingCreateSerializer(listing, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(ListingDetailSerializer(listing, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, identifier):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        listing = self.get_object(identifier)
        if not listing:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)
        if listing.seller.user != request.user and not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        listing.status = 'removed'
        listing.save(update_fields=['status'])
        return Response({"message": "Listing removed successfully"})


class ListingStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            listing = Listing.objects.get(id=pk)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        if listing.seller.user != request.user and not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        valid_statuses = ['active', 'reserved', 'sold', 'paused', 'removed']
        if new_status not in valid_statuses:
            return Response({"error": f"Invalid status. Must be one of {valid_statuses}"}, status=status.HTTP_400_BAD_REQUEST)

        listing.status = new_status
        listing.save(update_fields=['status'])
        return Response({
            "message": f"Listing status updated to {new_status}",
            "status": new_status,
            "id": listing.id
        })


class ListingFavoriteToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(id=pk)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        fav, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            fav.delete()
            return Response({"is_favorited": False, "message": "Removed from favorites"})
        return Response({"is_favorited": True, "message": "Added to favorites"})


class ListingContactClickView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(id=pk)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        method = request.data.get('method', 'call')
        if method in ['call', 'whatsapp', 'message', 'email']:
            ContactClickEvent.objects.create(listing=listing, contact_method=method)
            listing.contact_clicks_count += 1
            listing.save(update_fields=['contact_clicks_count'])

            if hasattr(listing, 'seller'):
                listing.seller.total_contact_clicks += 1
                listing.seller.save(update_fields=['total_contact_clicks'])

        return Response({
            "success": True,
            "contact_clicks": listing.contact_clicks_count
        })


class ListingReportView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(id=pk)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('reason', 'scam')
        description = request.data.get('description', '')
        reporter_email = request.data.get('email', '')

        ListingReport.objects.create(
            listing=listing,
            reporter=request.user if request.user.is_authenticated else None,
            reporter_email=reporter_email,
            reason=reason,
            description=description,
            status='pending'
        )
        return Response({
            "message": "Thank you. Your report has been submitted to youGO-mart moderators."
        }, status=status.HTTP_201_CREATED)


class FeaturedListingsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Listing.objects.filter(status='active', is_promoted=True)[:8]
        if not queryset.exists():
            # Fallback to top viewed listings if none explicitly promoted
            queryset = Listing.objects.filter(status='active').order_by('-views_count')[:8]
        serializer = ListingCardSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class RecentListingsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Listing.objects.filter(status='active').order_by('-created_at')[:12]
        serializer = ListingCardSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class RelatedListingsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            target = Listing.objects.get(id=pk)
            related = (
                Listing.objects.filter(category=target.category, status='active')
                .exclude(id=target.id)
                .order_by('-created_at')[:6]
            )
            serializer = ListingCardSerializer(related, many=True, context={'request': request})
            return Response(serializer.data)
        except Listing.DoesNotExist:
            return Response([], status=200)
