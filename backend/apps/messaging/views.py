from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.messaging.models import Conversation, ConversationParticipant, Message
from apps.messaging.serializers import ConversationSerializer, MessageSerializer
from apps.listings.models import Listing
from apps.notifications.models import Notification

class ConversationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        conv_ids = ConversationParticipant.objects.filter(user=request.user).values_list('conversation_id', flat=True)
        conversations = Conversation.objects.filter(id__in=conv_ids).select_related('listing').prefetch_related('participants', 'messages')
        serializer = ConversationSerializer(conversations, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        listing_id = request.data.get('listing_id')
        initial_message = request.data.get('message', '').strip()

        if not listing_id:
            return Response({"error": "listing_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not initial_message:
            return Response({"error": "message content cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        seller_user = listing.seller.user
        if seller_user == request.user:
            return Response({"error": "You cannot start a conversation with yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Check existing conversation for this listing between these 2 users
        existing = (
            Conversation.objects.filter(listing=listing)
            .filter(participants__user=request.user)
            .filter(participants__user=seller_user)
            .first()
        )

        if existing:
            conv = existing
        else:
            conv = Conversation.objects.create(listing=listing)
            ConversationParticipant.objects.create(conversation=conv, user=request.user)
            ConversationParticipant.objects.create(conversation=conv, user=seller_user)

        # Add message
        msg = Message.objects.create(
            conversation=conv,
            sender=request.user,
            content=initial_message
        )

        # Trigger in-app notification for seller
        sender_name = request.user.profile.display_name if hasattr(request.user, 'profile') else request.user.username
        Notification.objects.create(
            recipient=seller_user,
            notification_type='message',
            title=f"New message from {sender_name}",
            message=f"{sender_name} sent you an inquiry about '{listing.title}': {initial_message[:60]}...",
            link=f"/messages?id={conv.id}"
        )

        return Response({
            "conversation_id": conv.id,
            "message": MessageSerializer(msg, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)


class ConversationDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk, participants__user=request.user)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

        # Mark unread messages sent by others as read
        conv.messages.exclude(sender=request.user).filter(is_read=False).update(is_read=True)

        messages = conv.messages.all().select_related('sender', 'sender__profile')
        msg_serializer = MessageSerializer(messages, many=True, context={'request': request})
        conv_serializer = ConversationSerializer(conv, context={'request': request})

        return Response({
            "conversation": conv_serializer.data,
            "messages": msg_serializer.data
        })


class SendMessageView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk, participants__user=request.user)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '').strip()
        if not content:
            return Response({"error": "Message content cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        msg = Message.objects.create(
            conversation=conv,
            sender=request.user,
            content=content
        )
        conv.save(update_fields=['updated_at'])

        # Notify recipient
        recipient_part = conv.participants.exclude(user=request.user).first()
        if recipient_part:
            sender_name = request.user.profile.display_name if hasattr(request.user, 'profile') else request.user.username
            Notification.objects.create(
                recipient=recipient_part.user,
                notification_type='message',
                title=f"Message from {sender_name}",
                message=content[:80],
                link=f"/messages?id={conv.id}"
            )

        return Response(MessageSerializer(msg, context={'request': request}).data, status=status.HTTP_201_CREATED)
