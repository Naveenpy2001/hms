from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import PatientRegister
from .serializers import PatientSerializer,TodayPatientSerializer
from django.utils import timezone



class PatientViewSet(viewsets.ViewSet):
    def list(self, request):
        now = timezone.localtime()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)

        patients = PatientRegister.objects.filter(created_at__range=(start_of_day, end_of_day))

        if patients.exists():
            serializer = TodayPatientSerializer(patients, many=True)
            return Response(serializer.data)
        else:
            return Response({"message": "No patients today"}, status=200)


class PatientStatsViewSet(viewsets.ViewSet):
    def list(self, request):
        now = timezone.localtime()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
        current_month = now.month
        current_year = now.year

        total_patients = PatientRegister.objects.count()
        patients = PatientRegister.objects.filter(created_at__range=(start_of_day, end_of_day)).count()
        monthly_patients = PatientRegister.objects.filter(
            created_at__month=current_month, created_at__year=current_year
        ).count()

        return Response({
            "total_patients": total_patients,
            "today_patients": patients,
            "monthly_patients": monthly_patients
        })
    


from rest_framework import viewsets
from rest_framework.response import Response
from django.utils import timezone
from .models import MonthlyStats

class MonthlyPatientStatsViewSet(viewsets.ViewSet):
    def list(self, request):
        now = timezone.localtime()
        current_month = now.month
        current_year = now.year
        last_month = current_month - 1 if current_month > 1 else 12
        last_month_year = current_year if current_month > 1 else current_year - 1

        # Get current month stats
        total_patients = PatientRegister.objects.count()


        # Get last month stats
        last_month_stats = MonthlyStats.objects.filter(
            month=last_month, year=last_month_year
        ).first()

        response_data = {
            "last_month": {
                "month": last_month,
                "year": last_month_year,
                "total_patients": last_month_stats.total_patients if last_month_stats else 0
            },
            "current_month": {
                "month": current_month,
                "year": current_year,
                "total_patients": total_patients
            }
        }

        return Response(response_data)

from .models import PaymentStats
from rest_framework.decorators import action

class PaymentStatsViewSet(viewsets.ViewSet):
    """ ViewSet to handle total patients count and payments """

    def list(self, request):
        """ Get total patients count and total amount """
        stats, _ = PaymentStats.objects.get_or_create(id=1)
        return Response({
            "total_patients": stats.total_patients,
            "total_amount": stats.total_amount,
            "last_payment_date": stats.last_payment_date,
        })

    @action(detail=False, methods=['post'])
    def reset_payment(self, request):
        """ Resets the patient count and total amount after payment """
        stats, _ = PaymentStats.objects.get_or_create(id=1)
        stats.reset_counts()
        return Response({"message": "Payment recorded. Count reset."}, status=200)




from django.contrib.auth import login
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CustomUser
from .serializers import RegisterSerializer, OTPVerifySerializer, ResendOTPSerializer, LoginSerializer

class UserViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "OTP sent to your email"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='verify-otp')
    def verify_otp(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, email=serializer.validated_data['email'])
            if user.otp == serializer.validated_data['otp']:
                user.is_verified = True
                user.otp = None
                user.save()
                return Response({"message": "Account verified successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='resend-otp')
    def resend_otp(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, email=serializer.validated_data['email'])
            if user.is_verified:
                return Response({"message": "User is already verified"}, status=status.HTTP_400_BAD_REQUEST)

            user.generate_otp()
            return Response({"message": "OTP resent successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    





from django.utils import timezone
from datetime import timedelta

class PatientRegisterView(viewsets.ModelViewSet):
    queryset = PatientRegister.objects.all()
    serializer_class = PatientSerializer

    @action(detail=False,methods=['get'],url_path='pending')
    def not_completed(self,request):
        completed = self.queryset.filter(status="Pending")
        serializer = self.get_serializer(completed,many=True)
        return Response(serializer.data)
    
    @action(detail=False,methods=['get'],url_path='completed')
    def completed_patients(self,request):
        completed = self.queryset.filter(status="Completed")
        serializer = self.get_serializer(completed,many=True)
        return Response(serializer.data)
    
    @action(detail=False,methods=['get'],url_path='today_completed')
    def recet_completed(self,request):
        last_24_hours = timezone.now() - timedelta(hours=24)
        recent_completed = self.queryset.filter(
            status = 'Completed',
            updated_at__gte = last_24_hours
        )
        serialize =  self.get_serializer(recent_completed,many=True)
        return Response(serialize.data)

    @action(detail=False, methods=['get'], url_path='patients_stats')
    def get_stats(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        # Querysets, not counts
        completed_today_qs = self.queryset.filter(created_at__gte=today_start)
        completed_month_qs = self.queryset.filter(created_at__gte=month_start)
        completed_year_qs = self.queryset.filter( created_at__gte=year_start)
        # Serialize the querysets
        serializer_today = self.get_serializer(completed_today_qs, many=True)
        serializer_month = self.get_serializer(completed_month_qs, many=True)
        serializer_year = self.get_serializer(completed_year_qs, many=True)
        return Response({
            'completed_today_count': completed_today_qs.count(),
            'completed_this_month_count': completed_month_qs.count(),
            'completed_this_year_count': completed_year_qs.count(),
            # 'today_patients_list': serializer_today.data,
            # 'month_patients_list': serializer_month.data
        })
    


from django.template.loader import get_template
from xhtml2pdf import pisa
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
import io


class GeneratePDFView(APIView):
    def get(self, request, patient_id):
        try:
            patient = PatientRegister.objects.get(id=patient_id)
            
            # Process tablets data (assuming it's stored as JSON in the model)
            tablets = []
            if patient.tablets:  # Check if tablets data exists
                tablets = patient.tablets
            
            # Process injection details (assuming it's stored as JSON)
            injection_details = patient.injectionDetails or {}
            
            template_path = 'pdf_template.html'
            context = {
                'title': 'Patient Medical Report',
                'patient': {
                    'first_name': patient.first_name,
                    'last_name': patient.last_name,
                    'full_name': f"{patient.first_name} {patient.last_name}",
                    'email': patient.email,
                    'phone': patient.phone,
                    'aadhar': patient.aadhar,
                    'address': patient.address,
                    'gender': patient.gender,
                    'disease': patient.disease,
                    'other_disease': patient.other_disease,
                    'age': patient.age,
                    'weight': patient.weight,
                    'temperature': patient.temparature,
                    'bp': patient.bp,
                    'doctor_advice': patient.doctorAdvice,
                    'patient_type': patient.patientType,
                    'bed_assign': patient.bed_assign,
                    'payment_type': patient.paymentType,
                    'amount': patient.amount,
                    'date': patient.date,
                    'injection_required': "Yes" if patient.injectionRequired else "No",
                    'injection_details': injection_details,
                    'tablets': tablets,
                    'selected_test': patient.selectedTest,
                    'status': patient.status,
                    'created_at': patient.created_at,
                    'updated_at': patient.updated_at
                },
                'hospital': {
                    'name': "Amma Hospital",
                    'address': "Near Ganesh Hotel",
                    'location': "Madanapalle,Andhra Pradesh, 517325"
                }
            }

            template = get_template(template_path)
            html = template.render(context)
            result = io.BytesIO()
            pisa_status = pisa.CreatePDF(html, dest=result)

            if pisa_status.err:
                return Response({'error': 'PDF generation failed'}, status=500)

            result.seek(0)
            response = HttpResponse(result.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="patient_report_{patient_id}.pdf"'
            return response
            
        except PatientRegister.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=404)