from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager
from django.utils.timezone import now
from django.core.mail import send_mail
from django.conf import settings
import random


# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, username=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)

        if not username:
            username = email

        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)

        # Generate OTP on user creation
        user.generate_otp(save_user=False)

        user.save(using=self._db)

        # Send OTP email after saving
        user.send_otp_email()

        return user

    def create_superuser(self, email, password=None, username=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, username, **extra_fields)


# Custom User Model
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    hospitalname = models.CharField(max_length=225)
    phonenumber = models.CharField(max_length=225)
    repetepassword = models.CharField(max_length=225)
    address = models.CharField(max_length=225)
    is_verified = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    # Generate OTP and save it
    def generate_otp(self, save_user=True):
        self.otp = str(random.randint(100000, 999999))
        print(f"🔢 Generated OTP: {self.otp}")

        if save_user:
            self.save(update_fields=['otp'])  # Save only OTP field

    # Send OTP Email
    def send_otp_email(self):
        # Ensure OTP exists before sending email
        if not self.otp:
            self.generate_otp()

        print(f"📧 Sending email to: {self.email}")
        print(f"🔢 OTP in Database: {self.otp}")  # Debugging OTP

        subject = "Your OTP Code"
        message = f"Hello {self.username},\n\nYour OTP code is: {self.otp}\n\nUse this to verify your account."

        try:
            email_status = send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [self.email],
                fail_silently=False,
            )
            print("✅ Email sent successfully!" if email_status else "❌ Email sending failed!")
        except Exception as e:
            print(f"🚨 Error sending email: {e}")

    # Resend OTP Function
    def resend_otp(self):
        self.generate_otp()
        self.send_otp_email()
        print(f"✅ Resent OTP: {self.otp}")

    # Override Save Method
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email  # Use email as username if not provided
        super().save(*args, **kwargs)


class PatientRegister(models.Model):
    first_name = models.CharField(max_length=225,null=True,blank=True)
    last_name = models.CharField(max_length=225,null=True,blank=True)
    email = models.EmailField(null=True,blank=True)
    phone = models.CharField(max_length=14,null=True,blank=True)
    aadhar = models.CharField(max_length=18,null=True,blank=True)
    address = models.CharField(max_length=225,null=True,blank=True)
    gender = models.CharField(max_length=25,null=True,blank=True)
    disease = models.CharField(max_length=225,null=True,blank=True)
    date = models.CharField(max_length=225,null=True,blank=True)
    weight = models.CharField(max_length=225,null=True,blank=True)
    other_disease = models.CharField(max_length=225,null=True,blank=True)
    day = models.CharField(max_length=225,null=True,blank=True)
    month = models.CharField(max_length=225,null=True,blank=True)
    year = models.CharField(max_length=225,null=True,blank=True)
    age = models.CharField(max_length=225,null=True,blank=True)
    amount = models.CharField(max_length=225,null=True,blank=True)
    temparature = models.CharField(max_length=25,null=True,blank=True)
    patientType = models.CharField(max_length=225,null=True,blank=True)
    bed_assign =  models.CharField(max_length=225,null=True,blank=True)
    paymentType = models.CharField(max_length=225,null=True,blank=True)
    bp = models.CharField(max_length=225,null=True,blank=True)

    doctorAdvice = models.CharField(max_length=225,null=True,blank=True)


    selectedTest = models.CharField(max_length=225,null=True,blank=True,default='No')
    injectionDetails = models.CharField(max_length=225,null=True,blank=True)
    injectionRequired = models.CharField(max_length=225,null=True,blank=True)
    numberOfTablets = models.CharField(max_length=225,null=True,blank=True)
    tablets = models.JSONField(default=list)
    status = models.CharField(max_length=50, default="Pending")

    payment_count = models.IntegerField(default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2,  null=True, blank=True, default=0.0)

    injectionRequired  = models.BooleanField(default=False)
    injectionDetails   = models.JSONField(default=dict,null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} - {self.user.email}"






from django.utils.timezone import now
from django.db.models.signals import post_save
from django.dispatch import receiver


class MonthlyStats(models.Model):
    month = models.IntegerField()  # Stores month (1-12)
    year = models.IntegerField()   # Stores year (e.g., 2025)
    total_patients = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('month', 'year')  # Ensures each month-year pair is unique

    def __str__(self):
        return f"{self.month}/{self.year} - {self.total_patients} patients"

@receiver(post_save, sender=PatientRegister)
def update_monthly_stats(sender, instance, created, **kwargs):
    if created:  # Only update if a new patient is added
        current_time = now()
        current_month = current_time.month
        current_year = current_time.year

        # Get or create the current month's stats
        stats, _ = MonthlyStats.objects.get_or_create(month=current_month, year=current_year)

        # Update total patient count dynamically
        stats.total_patients = PatientRegister.objects.filter(
            created_at__month=current_month,
            created_at__year=current_year
        ).count()

        stats.save()



class PaymentStats(models.Model):
    total_patients = models.PositiveIntegerField(default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_payment_date = models.DateTimeField(null=True, blank=True)

    def reset_counts(self):
        """ Reset total patients and total amount after payment is completed """
        self.total_patients = 0
        self.total_amount = 0.00
        self.last_payment_date = now()
        self.save()

@receiver(post_save, sender=PatientRegister)
def update_payment_stats(sender, instance, created, **kwargs):
    """ Update the patient count and payment amount on new registration """
    if created:
        stats, _ = PaymentStats.objects.get_or_create(id=1)  # Ensure a single record
        stats.total_patients += 1
        stats.total_amount += 20  # Each patient contributes 20 INR
        stats.save()

