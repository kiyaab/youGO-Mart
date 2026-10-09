from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer

class NotificationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(recipient=request.user).order_by('-created_at')[:30]
        unread_count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        serializer = NotificationSerializer(notifs, many=True)
        return Response({
            'unread_count': unread_count,
            'notifications': serializer.data
        })


class NotificationMarkReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(id=pk, recipient=request.user)
            notif.is_read = True
            notif.save(update_fields=['is_read'])
            return Response({"success": True})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)


class NotificationReadAllView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"success": True, "message": "All marked as read"})
