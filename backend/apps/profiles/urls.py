from django.urls import path
from apps.profiles.views import MyProfileView, PublicProfileView

urlpatterns = [
    path('me/', MyProfileView.as_view(), name='profile-me'),
    path('<int:pk>/', PublicProfileView.as_view(), name='profile-public'),
]
