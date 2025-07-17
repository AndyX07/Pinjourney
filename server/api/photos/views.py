from rest_framework import generics
from .models import Photo
from .serializers import PhotoSerializer
from rest_framework.exceptions import PermissionDenied
from utils.supabase_client import supabase
from uuid import uuid4
import os
from dotenv import load_dotenv

load_dotenv()

class PhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = PhotoSerializer

    def get_queryset(self):
        return Photo.objects.filter(location__trip__user=self.request.user).order_by('id')
    
    def perform_create(self, serializer):
        request = self.request
        file = request.FILES.get('image')
        location = serializer.validated_data.get('location')
        if location.trip.user != self.request.user:
            raise PermissionDenied("You cannot add a photo to someone else's location")
        if file:
            filename = f'{uuid4()}_{file.name}'
            file_bytes = file.read()
            try:
                res = supabase.storage.from_(os.getenv("SUPABASE_BUCKET_NAME")).upload(filename, file_bytes, {"content-type": file.content_type})
            except Exception as e:
                raise PermissionDenied(f'File upload failed; {e}')
            public_url = f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{os.getenv('SUPABASE_BUCKET_NAME')}/{filename}"
            serializer.save(image_url=public_url)
        else:
            raise PermissionDenied("Image file is required.")


class PhotoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Photo.objects.filter(location__trip__user=self.request.user)
        
