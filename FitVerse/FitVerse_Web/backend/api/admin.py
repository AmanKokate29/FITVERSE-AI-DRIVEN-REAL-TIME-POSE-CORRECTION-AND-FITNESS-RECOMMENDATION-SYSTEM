from django.contrib import admin
from .models import Trainer, Testimonial, Service, UserProfile, FoodLog

@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'experience_years']
    search_fields = ['name', 'specialty']

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'is_active']
    list_filter = ['is_active']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'age', 'gender', 'weight', 'height', 'maintenance_calories', 'created_at']
    list_filter = ['gender', 'activity_level', 'created_at']
    search_fields = ['session_id']

@admin.register(FoodLog)
class FoodLogAdmin(admin.ModelAdmin):
    list_display = ['food_name', 'calories', 'servings', 'total_calories', 'session_id', 'logged_at']
    list_filter = ['date', 'logged_at']
    search_fields = ['food_name', 'session_id']
    readonly_fields = ['total_calories', 'logged_at', 'date']
