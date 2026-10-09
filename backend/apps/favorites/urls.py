from django.urls import path
from apps.favorites.views import FavoriteListView, SavedSearchListCreateView, SavedSearchDeleteView

urlpatterns = [
    path('', FavoriteListView.as_view(), name='favorites-list'),
    path('saved-searches/', SavedSearchListCreateView.as_view(), name='saved-searches-list'),
    path('saved-searches/<int:pk>/', SavedSearchDeleteView.as_view(), name='saved-search-delete'),
]
