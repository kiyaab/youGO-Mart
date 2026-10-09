from django.urls import path
from apps.moderation.views import (
    AdminMetricsView,
    AdminPendingListingsView,
    AdminModerateListingView,
    AdminVerificationsListView,
    AdminModerateVerificationView,
    AdminReportsListView,
    AdminResolveReportView,
    AdminUsersListView,
    AdminToggleUserStatusView
)

urlpatterns = [
    path('metrics/', AdminMetricsView.as_view(), name='admin-metrics'),
    path('listings/pending/', AdminPendingListingsView.as_view(), name='admin-pending-listings'),
    path('listings/<int:pk>/moderate/', AdminModerateListingView.as_view(), name='admin-moderate-listing'),
    path('verifications/', AdminVerificationsListView.as_view(), name='admin-verifications'),
    path('verifications/<int:pk>/moderate/', AdminModerateVerificationView.as_view(), name='admin-moderate-verification'),
    path('reports/', AdminReportsListView.as_view(), name='admin-reports'),
    path('reports/<int:pk>/resolve/', AdminResolveReportView.as_view(), name='admin-resolve-report'),
    path('users/', AdminUsersListView.as_view(), name='admin-users'),
    path('users/<int:pk>/toggle-status/', AdminToggleUserStatusView.as_view(), name='admin-toggle-user-status'),
]
