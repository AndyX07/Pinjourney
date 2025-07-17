from django.urls import path
from .views import RecommendView

urlpatterns = [
    path("", RecommendView.as_view()),
]