from django.urls import path
from .views import (
    CheckoutView,
    BuyerOrderListView,
    BuyerOrderDetailView,
    SellerOrderListView,
    SellerOrderItemStatusView,
)

urlpatterns = [
    path('', BuyerOrderListView.as_view(), name='buyer-orders-list'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('detail/<str:order_number>/', BuyerOrderDetailView.as_view(), name='buyer-order-detail'),
    path('seller/', SellerOrderListView.as_view(), name='seller-orders-list'),
    path('seller/items/<int:item_id>/', SellerOrderItemStatusView.as_view(), name='seller-order-item-status'),
]
