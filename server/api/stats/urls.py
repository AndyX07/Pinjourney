from django.urls import path
from .views import TravelStatsView

urlpatterns = [
    path('', TravelStatsView.as_view(), name='travel-stats'),
]
