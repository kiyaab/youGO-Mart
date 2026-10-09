from django.urls import path
from apps.orders import views

urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart-view'),
    path('cart/items/<int:item_id>/', views.CartItemDetailView.as_view(), name='cart-item-detail'),
    path('orders/', views.OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<str:order_identifier>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('seller/orders/', views.SellerOrderListView.as_view(), name='seller-order-list'),
    path('seller/orders/items/<int:item_id>/', views.SellerOrderItemUpdateView.as_view(), name='seller-order-item-update'),
    path('admin/orders/', views.AdminOrderListView.as_view(), name='admin-order-list'),
]
