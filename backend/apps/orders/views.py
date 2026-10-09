from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, CheckoutSerializer
from apps.listings.models import Listing

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        return CartItemAddView().post(request)


class CartItemAddView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get('listing_id')
        quantity = int(request.data.get('quantity', 1))

        if not listing_id:
            return Response({"error": "listing_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        listing = get_object_or_404(Listing, id=listing_id, status='active')
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            listing=listing,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        cart.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        quantity = request.data.get('quantity')
        if quantity is not None:
            q = int(quantity)
            if q <= 0:
                item.delete()
            else:
                item.quantity = q
                item.save()

        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        return Response(CartSerializer(cart).data)


class CartClearView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)


class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart_items = cart.items.select_related('listing', 'listing__seller').all()

        if not cart_items.exists():
            return Response({"error": "Cannot checkout with an empty shopping cart."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        total_amount = sum(item.subtotal for item in cart_items)
        if total_amount <= 0:
            return Response({"error": "Invalid order calculation."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            buyer=request.user,
            total_amount=total_amount,
            currency='ETB',
            shipping_name=data['shipping_name'],
            shipping_phone=data['shipping_phone'],
            shipping_city=data.get('shipping_city', 'Addis Ababa'),
            shipping_address=data.get('shipping_address', 'Addis Ababa'),
            payment_method=data.get('payment_method', 'telebirr'),
            payment_status='paid' if data.get('payment_method') in ['telebirr', 'cbe_birr'] else 'pending',
            status='confirmed',
            notes=data.get('notes', '')
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                listing=item.listing,
                seller=item.listing.seller,
                product_title=item.listing.title,
                unit_price=item.unit_price,
                quantity=item.quantity,
                subtotal=item.subtotal,
                fulfillment_status='processing'
            )

        cart_items.delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class BuyerOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user).prefetch_related('items')


class BuyerOrderDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_number):
        order = get_object_or_404(
            Order.objects.prefetch_related('items'),
            order_number=order_number,
            buyer=request.user
        )
        return Response(OrderSerializer(order).data)


class SellerOrderListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'seller_profile'):
            return Response({"error": "Seller profile required."}, status=status.HTTP_403_FORBIDDEN)

        seller_profile = request.user.seller_profile
        items = OrderItem.objects.filter(seller=seller_profile).select_related('order', 'order__buyer').order_by('-order__created_at')

        data = []
        for it in items:
            data.append({
                'item_id': it.id,
                'order_number': it.order.order_number,
                'created_at': it.order.created_at,
                'product_title': it.product_title,
                'quantity': it.quantity,
                'unit_price': it.unit_price,
                'subtotal': it.subtotal,
                'fulfillment_status': it.fulfillment_status,
                'payment_method': it.order.payment_method,
                'payment_status': it.order.payment_status,
                'shipping_city': it.order.shipping_city,
                'shipping_address': it.order.shipping_address,
                'shipping_phone': it.order.shipping_phone,
                'buyer_name': it.order.shipping_name,
            })
        return Response(data)


class SellerOrderItemStatusView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        if not hasattr(request.user, 'seller_profile'):
            return Response({"error": "Seller profile required."}, status=status.HTTP_403_FORBIDDEN)

        seller_profile = request.user.seller_profile
        item = get_object_or_404(OrderItem, id=item_id, seller=seller_profile)
        
        new_status = request.data.get('fulfillment_status')
        if new_status in dict(OrderItem.FULFILLMENT_CHOICES):
            item.fulfillment_status = new_status
            item.save()
            return Response({"message": "Status updated successfully", "fulfillment_status": new_status})

        return Response({"error": "Invalid fulfillment status"}, status=status.HTTP_400_BAD_REQUEST)
