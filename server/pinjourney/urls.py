from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/locations/', include('api.locations.urls')),
    path('api/photos/', include('api.photos.urls')),
    path('api/trips/', include('api.trips.urls')),
    path('api/users/', include('api.users.urls')),
    path('api/stats/', include('api.stats.urls')),
    path('api/recommendations/', include('api.recommendation.urls')),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]