from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.db.models import Count, Q
from apps.categories.models import Category
from apps.categories.serializers import CategorySerializer

class CategoryListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Fetch root categories (parent=None) with active listing counts
        categories = (
            Category.objects.filter(parent=None, is_active=True)
            .annotate(listing_count=Count('listings', filter=Q(listings__status='active')))
            .order_by('sort_order', 'name')
        )
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CategoryDetailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            category = (
                Category.objects.filter(slug=slug, is_active=True)
                .annotate(listing_count=Count('listings', filter=Q(listings__status='active')))
                .first()
            )
            if not category:
                return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategorySerializer(category)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LocationListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        locations_data = [
            {
                "region": "Addis Ababa",
                "city": "Addis Ababa",
                "neighborhoods": [
                    "Bole", "Kazanchis", "Piassa", "Sarbet", "Mexico",
                    "CMC", "Megenagna", "Gerji", "Ayat", "Lebu",
                    "Gotera", "Summit", "22 Mazoria", "Tor Hailoch", "Olympia"
                ]
            },
            {
                "region": "Sidama",
                "city": "Hawassa",
                "neighborhoods": ["Piazza", "Menhariya", "Tabor", "Loke", "Adis Ketema"]
            },
            {
                "region": "Oromia",
                "city": "Adama (Nazret)",
                "neighborhoods": ["Bole", "Posta Bet", "01 Kebele", "Franco", "Dembela"]
            },
            {
                "region": "Amhara",
                "city": "Bahir Dar",
                "neighborhoods": ["Kebele 04", "Tana Subcity", "Gish Abay", "Fasilo", "Ginbot 20"]
            },
            {
                "region": "Dire Dawa",
                "city": "Dire Dawa",
                "neighborhoods": ["Kezira", "Megala", "Gende Kore", "Sabian"]
            },
            {
                "region": "Tigray",
                "city": "Mekelle",
                "neighborhoods": ["Kedamay Weyane", "Hadnet", "Ayder", "Hawelti"]
            },
            {
                "region": "Oromia",
                "city": "Bishoftu (Debre Zeyit)",
                "neighborhoods": ["Bishoftu Central", "Babogaya", "Hora", "Kuriftu"]
            },
            {
                "region": "Amhara",
                "city": "Gondar",
                "neighborhoods": ["Arada", "Maraki", "Azezo", "Fasil"]
            },
            {
                "region": "Oromia",
                "city": "Jimma",
                "neighborhoods": ["Bole", "Hermata", "Mendera", "Jiren"]
            }
        ]
        return Response(locations_data)
