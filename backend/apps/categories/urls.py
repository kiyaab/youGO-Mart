from django.urls import path
from apps.categories.views import CategoryListView, CategoryDetailView, LocationListView

urlpatterns = [
    path('', CategoryListView.as_view(), name='category-list'),
    path('locations/', LocationListView.as_view(), name='location-list'),
    path('<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
]
