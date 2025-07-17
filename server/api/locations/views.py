from rest_framework import generics
from .models import Location
from api.trips.models import Trip
from .serializers import LocationSerializer
from rest_framework.exceptions import PermissionDenied

class LocationListCreateView(generics.ListCreateAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        return Location.objects.filter(trip__user=self.request.user).order_by('id')
    
    def perform_create(self, serializer):
        trip = serializer.validated_data.get('trip')
        if trip.user != self.request.user:
            raise PermissionDenied("You cannot add a location to someone else's trip")
        serializer.save()

class LocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LocationSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Location.objects.filter(trip__user=self.request.user)