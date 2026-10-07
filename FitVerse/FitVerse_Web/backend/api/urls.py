from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrainerViewSet, TestimonialViewSet, ServiceViewSet,
    UserProfileViewSet, FoodLogViewSet, home_data, coaching_consultation_request
)

router = DefaultRouter()
router.register(r'trainers', TrainerViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'food-logs', FoodLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('home/', home_data, name='home-data'),
    path('coaching-consultation/', coaching_consultation_request, name='coaching-consultation'),
]
