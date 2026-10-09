from django.urls import path
from apps.accounts.views import RegisterView, LoginView, LogoutView, CurrentUserView, DemoSwitchView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', CurrentUserView.as_view(), name='auth-me'),
    path('switch-demo/', DemoSwitchView.as_view(), name='auth-demo-switch'),
]
