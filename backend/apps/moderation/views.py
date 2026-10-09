from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from apps.moderation.models import ListingReport, AuditLog
from apps.moderation.serializers import ListingReportSerializer, AuditLogSerializer
from apps.listings.models import Listing
from apps.listings.serializers import ListingCardSerializer
from apps.sellers.models import SellerProfile, SellerVerification
from apps.sellers.serializers import SellerVerificationSerializer
from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer
from apps.notifications.models import Notification

class IsAdminOrModerator(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.is_staff or request.user.role in ['moderator', 'admin']


class AdminMetricsView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        return Response({
            'total_users': User.objects.count(),
            'active_sellers': SellerProfile.objects.filter(seller_status='active').count(),
            'active_listings': Listing.objects.filter(status='active').count(),
            'pending_listings': Listing.objects.filter(status='pending').count(),
            'pending_verifications': SellerVerification.objects.filter(status='pending').count(),
            'open_reports': ListingReport.objects.filter(status='pending').count(),
            'recent_logs': AuditLogSerializer(AuditLog.objects.all()[:10], many=True).data
        })


class AdminPendingListingsView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        pending = Listing.objects.filter(status='pending').order_by('-created_at')
        serializer = ListingCardSerializer(pending, many=True, context={'request': request})
        return Response(serializer.data)


class AdminModerateListingView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(id=pk)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'approve' or 'reject'
        reason = request.data.get('reason', '')

        if action == 'approve':
            listing.status = 'active'
            listing.rejection_reason = ''
            listing.save(update_fields=['status', 'rejection_reason'])

            AuditLog.objects.create(
                actor=request.user,
                action='APPROVED_LISTING',
                target_type='Listing',
                target_id=str(listing.id),
                details=f"Approved listing '{listing.title}'"
            )

            Notification.objects.create(
                recipient=listing.seller.user,
                notification_type='listing_approved',
                title="Your listing is now Live!",
                message=f"Great news! Your listing '{listing.title}' has been reviewed and published.",
                link=f"/listings/{listing.slug}"
            )
            return Response({"message": "Listing approved and live", "status": "active"})

        elif action == 'reject':
            listing.status = 'rejected'
            listing.rejection_reason = reason
            listing.save(update_fields=['status', 'rejection_reason'])

            AuditLog.objects.create(
                actor=request.user,
                action='REJECTED_LISTING',
                target_type='Listing',
                target_id=str(listing.id),
                details=f"Rejected listing '{listing.title}'. Reason: {reason}"
            )

            Notification.objects.create(
                recipient=listing.seller.user,
                notification_type='listing_rejected',
                title="Listing needs updates",
                message=f"Your listing '{listing.title}' was rejected: {reason}. You can edit and resubmit.",
                link="/dashboard"
            )
            return Response({"message": "Listing rejected", "status": "rejected"})

        return Response({"error": "Action must be 'approve' or 'reject'"}, status=status.HTTP_400_BAD_REQUEST)


class AdminVerificationsListView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        verifications = SellerVerification.objects.filter(status='pending').select_related('seller', 'seller__user')
        serializer = SellerVerificationSerializer(verifications, many=True)
        return Response(serializer.data)


class AdminModerateVerificationView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def post(self, request, pk):
        try:
            item = SellerVerification.objects.get(id=pk)
        except SellerVerification.DoesNotExist:
            return Response({"error": "Verification request not found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'approve' or 'reject'
        notes = request.data.get('notes', '')

        if action == 'approve':
            item.status = 'approved'
            item.reviewed_by = request.user
            item.reviewed_at = timezone.now()
            item.save()

            seller = item.seller
            seller.verification_status = 'verified'
            seller.verified_at = timezone.now()
            seller.save(update_fields=['verification_status', 'verified_at'])

            user = seller.user
            user.role = 'verified_seller'
            user.is_verified = True
            user.save(update_fields=['role', 'is_verified'])

            Notification.objects.create(
                recipient=user,
                notification_type='verification',
                title="Verified Seller Badge Granted!",
                message="Congratulations! Your seller verification has been approved. The verified badge is now displayed on your listings and profile.",
                link="/dashboard"
            )
            return Response({"message": "Seller verified successfully"})

        elif action == 'reject':
            item.status = 'rejected'
            item.reviewed_by = request.user
            item.reviewed_at = timezone.now()
            item.rejection_reason = notes
            item.save()

            seller = item.seller
            seller.verification_status = 'rejected'
            seller.save(update_fields=['verification_status'])

            Notification.objects.create(
                recipient=seller.user,
                notification_type='verification',
                title="Seller Verification Update",
                message=f"Your verification request could not be approved at this time: {notes}",
                link="/dashboard"
            )
            return Response({"message": "Verification rejected"})

        return Response({"error": "Action must be 'approve' or 'reject'"}, status=status.HTTP_400_BAD_REQUEST)


class AdminReportsListView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        reports = ListingReport.objects.filter(status='pending').select_related('listing', 'reporter')
        serializer = ListingReportSerializer(reports, many=True)
        return Response(serializer.data)


class AdminResolveReportView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def post(self, request, pk):
        try:
            report = ListingReport.objects.get(id=pk)
        except ListingReport.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'remove_listing', 'dismiss'
        notes = request.data.get('notes', '')

        report.reviewed_by = request.user
        report.moderator_notes = notes

        if action == 'remove_listing':
            report.status = 'resolved'
            report.save()
            listing = report.listing
            listing.status = 'removed'
            listing.save(update_fields=['status'])
            return Response({"message": "Report resolved and listing removed"})
        else:
            report.status = 'dismissed'
            report.save()
            return Response({"message": "Report dismissed as non-violating"})


class AdminUsersListView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')[:50]
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class AdminToggleUserStatusView(views.APIView):
    permission_classes = [IsAdminOrModerator]

    def post(self, request, pk):
        try:
            target_user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        target_user.is_active = not target_user.is_active
        target_user.save(update_fields=['is_active'])
        return Response({
            "is_active": target_user.is_active,
            "message": f"User {'reinstated' if target_user.is_active else 'suspended'}"
        })
