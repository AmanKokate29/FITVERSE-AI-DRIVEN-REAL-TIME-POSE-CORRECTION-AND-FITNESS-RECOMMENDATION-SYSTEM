from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import date
from .models import Trainer, Testimonial, Service, UserProfile, FoodLog
from .serializers import (
    TrainerSerializer, TestimonialSerializer, ServiceSerializer,
    UserProfileSerializer, FoodLogSerializer
)

class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class FoodLogViewSet(viewsets.ModelViewSet):
    queryset = FoodLog.objects.all()
    serializer_class = FoodLogSerializer
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's food logs for a session"""
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = date.today()
        logs = FoodLog.objects.filter(session_id=session_id, date=today)
        serializer = self.get_serializer(logs, many=True)
        
        total_calories = sum(log.total_calories for log in logs)
        
        return Response({
            'logs': serializer.data,
            'total_calories': total_calories,
            'count': logs.count()
        })

@api_view(['GET'])
def home_data(request):
    """
    API endpoint that returns all data needed for the home page
    """
    trainers = Trainer.objects.all()[:3]  # Get top 3 trainers
    testimonials = Testimonial.objects.all()[:3]  # Get latest 3 testimonials
    services = Service.objects.filter(is_active=True)[:4]  # Get 4 active services
    
    data = {
        'trainers': TrainerSerializer(trainers, many=True).data,
        'testimonials': TestimonialSerializer(testimonials, many=True).data,
        'services': ServiceSerializer(services, many=True).data,
    }
    
    return Response(data)

@api_view(['POST'])
def coaching_consultation_request(request):
    """
    API endpoint to handle coaching consultation form submissions
    Sends an email notification to team.fitverse@gmail.com
    """
    try:
        data = request.data
        
        print("=" * 80)
        print("COACHING CONSULTATION REQUEST RECEIVED")
        print("=" * 80)
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'fitnessLevel', 'goal', 'coachingType']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'error': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Prepare email content
        subject = f'New Coaching Consultation Request - {data.get("name")}'
        
        message = f"""
New Coaching Consultation Request Received

Client Information:
-------------------
Name: {data.get('name')}
Email: {data.get('email')}
Phone: {data.get('phone')}

Fitness Details:
-------------------
Current Fitness Level: {data.get('fitnessLevel')}
Primary Goal: {data.get('goal')}
Preferred Coaching Type: {data.get('coachingType')}
Preferred Contact Time: {data.get('preferredTime', 'Not specified')}

Additional Information:
-------------------
{data.get('message', 'No additional information provided')}

-------------------
This request was submitted on {timezone.now().strftime('%B %d, %Y at %I:%M %p')}
        """
        
        print("Sending email...")
        print(f"Subject: {subject}")
        print(f"From: {settings.DEFAULT_FROM_EMAIL}")
        print(f"To: team.fitverse@gmail.com")
        print("-" * 80)
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['team.fitverse@gmail.com'],
            fail_silently=False,
        )
        
        print("✓ Email sent successfully!")
        print("=" * 80)
        
        return Response(
            {'message': 'Consultation request submitted successfully'},
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        print(f"✗ ERROR: {str(e)}")
        print("=" * 80)
        return Response(
            {'error': f'Failed to submit request: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
