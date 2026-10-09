from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.favorites.models import Favorite, SavedSearch
from apps.favorites.serializers import FavoriteSerializer, SavedSearchSerializer

class FavoriteListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related('listing', 'listing__seller', 'listing__category').prefetch_related('listing__images')
        serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data)


class SavedSearchListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        searches = SavedSearch.objects.filter(user=request.user)
        serializer = SavedSearchSerializer(searches, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SavedSearchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SavedSearchDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            item = SavedSearch.objects.get(id=pk, user=request.user)
            item.delete()
            return Response({"message": "Saved search deleted"})
        except SavedSearch.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
