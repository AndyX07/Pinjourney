from rest_framework import serializers
from .models import Location
from api.photos.serializers import PhotoSerializer

class LocationSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    class Meta:
        model = Location
        fields = [
            'id', 'trip', 'name', 'country', 'latitude',
            'longitude', 'visited_on', 'notes', 'photos'
        ]
        read_only_fields = ['id']