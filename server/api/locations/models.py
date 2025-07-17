from django.db import models
from api.trips.models import Trip

class Location(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="locations")
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    visited_on = models.DateField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name