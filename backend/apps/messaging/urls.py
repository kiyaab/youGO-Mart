from django.urls import path
from apps.messaging.views import ConversationListView, ConversationDetailView, SendMessageView

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation-list-create'),
    path('<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('<int:pk>/messages/', SendMessageView.as_view(), name='conversation-send-message'),
]
