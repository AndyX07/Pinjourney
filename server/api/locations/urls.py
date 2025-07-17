from django.urls import path
from .views import LocationListCreateView, LocationDetailView

urlpatterns = [
    path('', LocationListCreateView.as_view(), name='location-list-create'),
    path('<int:pk>/', LocationDetailView.as_view(), name='location-detail'),
]
