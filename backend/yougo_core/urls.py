from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('django-admin/', admin.site.urls),
    
    # OpenAPI Schema & Interactive Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # youGO-mart API v1 Endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/profiles/', include('apps.profiles.urls')),
    path('api/v1/sellers/', include('apps.sellers.urls')),
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/listings/', include('apps.listings.urls')),
    path('api/v1/favorites/', include('apps.favorites.urls')),
    path('api/v1/conversations/', include('apps.messaging.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/admin/', include('apps.moderation.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
