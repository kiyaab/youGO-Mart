from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from apps.orders.models import Cart, CartItem, Order, OrderItem
from apps.orders.serializers import CartSerializer, CartItemSerializer, OrderSerializer, CheckoutSerializer
from apps.listings.models import Listing
from apps.sellers.models import SellerProfile

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        listing_id = request.data.get('listing_id')
        quantity = int(request.data.get('quantity', 1))

        if not listing_id:
            return Response({"error": "listing_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        listing = get_object_or_404(Listing, id=listing_id)
        if listing.status != 'active':
            return Response({"error": "This product is not currently available for purchase"}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(cart=cart, listing=listing)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = max(1, quantity)
        item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared successfully"})


class CartItemDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(item.cart).data)

    def delete(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)


class OrderListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(buyer=request.user).prefetch_related('items')
        return Response(OrderSerializer(orders, many=True).data)

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        direct_listing_id = data.get('direct_listing_id')
        direct_quantity = data.get('direct_quantity', 1)

        items_to_order = []
        if direct_listing_id:
            listing = get_object_or_404(Listing, id=direct_listing_id, status='active')
            items_to_order.append({
                'listing': listing,
                'quantity': max(1, direct_quantity),
                'price': listing.price,
                'seller': listing.seller,
                'title': listing.title
            })
        else:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            cart_items = cart.items.select_related('listing', 'listing__seller').all()
            if not cart_items.exists():
                return Response({"error": "Your shopping cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

            for ci in cart_items:
                if ci.listing.status != 'active':
                    return Response({"error": f"Item '{ci.listing.title}' is no longer active."}, status=status.HTTP_400_BAD_REQUEST)
                items_to_order.append({
                    'listing': ci.listing,
                    'quantity': ci.quantity,
                    'price': ci.listing.price,
                    'seller': ci.listing.seller,
                    'title': ci.listing.title
                })

        total_amount = sum(item['price'] * item['quantity'] for item in items_to_order)

        order = Order.objects.create(
            buyer=request.user,
            total_amount=total_amount,
            shipping_name=data['shipping_name'],
            shipping_phone=data['shipping_phone'],
            shipping_city=data['shipping_city'],
            shipping_address=data['shipping_address'],
            payment_method=data['payment_method'],
            payment_status='pending',
            status='confirmed',
            notes=data.get('notes', ''),
            tracking_number=f"TRK-{uuid_str()[:6].upper()}"
        )

        for item in items_to_order:
            OrderItem.objects.create(
                order=order,
                seller=item['seller'],
                listing=item['listing'],
                product_title=item['title'],
                unit_price=item['price'],
                quantity=item['quantity'],
                subtotal=item['price'] * item['quantity'],
                fulfillment_status='confirmed'
            )

        if not direct_listing_id:
            CartItem.objects.filter(cart__user=request.user).delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


def uuid_str():
    import uuid
    return uuid.uuid4().hex


class OrderDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_identifier):
        if str(order_identifier).isdigit():
            order = get_object_or_404(Order, id=int(order_identifier))
        else:
            order = get_object_or_404(Order, order_number=order_identifier)

        # STRICT RBAC: Buyer can view own, Admin can view all
        if order.buyer != request.user and request.user.role != 'admin':
            return Response({"error": "Access denied. You do not own this order."}, status=status.HTTP_403_FORBIDDEN)

        return Response(OrderSerializer(order).data)


class SellerOrderListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'seller':
            return Response({"error": "Seller credentials required."}, status=status.HTTP_403_FORBIDDEN)

        try:
            seller_prof = request.user.seller_profile
        except SellerProfile.DoesNotExist:
            return Response([])

        # Find orders that have items for this seller
        order_ids = OrderItem.objects.filter(seller=seller_prof).values_list('order_id', flat=True).distinct()
        orders = Order.objects.filter(id__in=order_ids).prefetch_related('items')
        return Response(OrderSerializer(orders, many=True).data)


class SellerOrderItemUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        if request.user.role != 'seller':
            return Response({"error": "Seller credentials required."}, status=status.HTTP_403_FORBIDDEN)

        seller_prof = get_object_or_404(SellerProfile, user=request.user)
        item = get_object_or_404(OrderItem, id=item_id, seller=seller_prof)

        new_status = request.data.get('fulfillment_status')
        if new_status in dict(Order.STATUS_CHOICES):
            item.fulfillment_status = new_status
            item.save()
            return Response(OrderSerializer(item.order).data)

        return Response({"error": "Invalid fulfillment status"}, status=status.HTTP_400_BAD_REQUEST)


class AdminOrderListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)

        orders = Order.objects.all().prefetch_related('items')[:100]
        return Response(OrderSerializer(orders, many=True).data)
