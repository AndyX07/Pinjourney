from django.db import models
from api.locations.models import Location

class Photo(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="photos")
    image_url = models.URLField()
    uploaded_at = models.DateTimeField(auto_now_add=True)