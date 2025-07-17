from rest_framework import serializers
from .models import Trip
from api.locations.serializers import LocationSerializer

class TripSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)
    class Meta:
        model = Trip
        fields = ['id', 'user', 'title', 'description', 'start_date', 'end_date', 'created_at', 'locations']
        read_only_fields = ['id', 'user', 'created_at']