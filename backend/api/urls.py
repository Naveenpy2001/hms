from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'patients',PatientRegisterView,basename='patient')
router.register(r'today-patients', PatientViewSet, basename='patients')
router.register(r'patient-stats', PatientStatsViewSet, basename="patient-stats")
router.register(r'monthly-patient-stats', MonthlyPatientStatsViewSet, basename="monthly-patient-stats")
router.register(r'users', UserViewSet, basename='user')



router.register(r'payment-stats', PaymentStatsViewSet, basename='payment-stats')



urlpatterns = [
    path('patient/pdf/<int:patient_id>/', GeneratePDFView.as_view(), name='generate_pdf'),
    path('',include(router.urls))
]

# urlpatterns = [
#     path('generate-pdf/', GeneratePatientPDF.as_view(), name='generate_pdf'),
# ]

