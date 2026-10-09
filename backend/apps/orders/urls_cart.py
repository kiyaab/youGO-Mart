from django.urls import path
from .views import (
    CartView,
    CartItemAddView,
    CartItemUpdateView,
    CartClearView,
)

urlpatterns = [
    path('', CartView.as_view(), name='cart-detail'),
    path('items/', CartItemAddView.as_view(), name='cart-item-add'),
    path('items/<int:item_id>/', CartItemUpdateView.as_view(), name='cart-item-update'),
    path('clear/', CartClearView.as_view(), name='cart-clear'),
]
