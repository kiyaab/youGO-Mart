from django.urls import path
from apps.sellers.views import (
    MySellerProfileView,
    PublicSellerProfileView,
    SellerVerificationView,
    SellerAnalyticsView
)

urlpatterns = [
    path('profile/', MySellerProfileView.as_view(), name='seller-my-profile'),
    path('<int:pk>/', PublicSellerProfileView.as_view(), name='seller-public-profile'),
    path('verification/', SellerVerificationView.as_view(), name='seller-verification'),
    path('analytics/', SellerAnalyticsView.as_view(), name='seller-analytics'),
]
