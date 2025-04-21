from rest_framework import serializers
from .models import PatientRegister
from django.utils import timezone

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientRegister
        fields = '__all__'
        read_only_fields = ['created_at']  # Ensure created_at is read-only

    def update(self, instance, validated_data):

        validated_data.pop('created_at', None)
        return super().update(instance, validated_data)
    

class TodayPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientRegister
        fields = ['first_name','last_name','email','created_at','phone','disease','amount']



from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [ 'email', 'password',"hospitalname",'phonenumber','repetepassword','address']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()



from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data['email']
        password = data['password']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_verified:
            raise serializers.ValidationError("User is not verified")

        if not user.check_password(password):  # 🔥 This ensures password checking is correct
            raise serializers.ValidationError("Invalid email or password")

        return user


