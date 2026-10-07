from django.db import models
from django.contrib.auth.models import User

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    bio = models.TextField()
    image = models.ImageField(upload_to='trainers/', null=True, blank=True)
    experience_years = models.IntegerField(default=0)
    certifications = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Testimonial(models.Model):
    client_name = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.IntegerField(default=5)
    image = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.client_name} - {self.rating} stars"

class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text="Icon class name")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title

class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    ACTIVITY_CHOICES = [
        ('sedentary', 'Sedentary'),
        ('light', 'Light'),
        ('moderate', 'Moderate'),
        ('active', 'Active'),
        ('veryActive', 'Very Active'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    weight = models.FloatField(help_text="Weight in kg")
    height = models.FloatField(help_text="Height in cm")
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_CHOICES)
    maintenance_calories = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile - {self.session_id or self.user}"

class FoodLog(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='food_logs', null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)
    food_name = models.CharField(max_length=200)
    calories = models.FloatField()
    servings = models.FloatField(default=1)
    total_calories = models.FloatField()
    logged_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['-logged_at']
    
    def save(self, *args, **kwargs):
        self.total_calories = self.calories * self.servings
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.food_name} - {self.total_calories} cal"

