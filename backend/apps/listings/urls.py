from django.urls import path
from apps.listings.views import (
    ListingListCreateView,
    ListingDetailView,
    ListingStatusUpdateView,
    ListingFavoriteToggleView,
    ListingContactClickView,
    ListingReportView,
    FeaturedListingsView,
    RecentListingsView,
    RelatedListingsView
)

urlpatterns = [
    path('', ListingListCreateView.as_view(), name='listing-list-create'),
    path('featured/', FeaturedListingsView.as_view(), name='listing-featured'),
    path('recent/', RecentListingsView.as_view(), name='listing-recent'),
    path('<int:pk>/related/', RelatedListingsView.as_view(), name='listing-related'),
    path('<int:pk>/favorite/', ListingFavoriteToggleView.as_view(), name='listing-favorite'),
    path('<int:pk>/contact-click/', ListingContactClickView.as_view(), name='listing-contact-click'),
    path('<int:pk>/report/', ListingReportView.as_view(), name='listing-report'),
    path('<int:pk>/status/', ListingStatusUpdateView.as_view(), name='listing-status-update'),
    path('<str:identifier>/', ListingDetailView.as_view(), name='listing-detail'),
]
