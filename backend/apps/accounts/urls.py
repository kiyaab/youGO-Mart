from django.urls import path
from apps.accounts.views import RegisterView, LoginView, GoogleAuthView, LogoutView, CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('google/', GoogleAuthView.as_view(), name='auth-google'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', CurrentUserView.as_view(), name='auth-me'),
]
