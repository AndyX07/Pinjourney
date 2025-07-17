from rest_framework import generics
from .models import Trip
from .serializers import TripSerializer

class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).order_by('id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)
