from django.urls import path
from .views import UserDetailView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
