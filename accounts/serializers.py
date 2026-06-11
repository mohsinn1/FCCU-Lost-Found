import re
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import StudentProfile
from django.db import transaction
import secrets
from django.utils import timezone
from django.core.mail import send_mail

class RegisterSerializer(serializers.Serializer):
    fccu_email = serializers.EmailField()
    full_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)



    def validate(self,attrs):
        email = attrs.get('fccu_email')
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Passwords must match.'})

        if not re.fullmatch(r'^\d+@formanite\.fccollege\.edu\.pk$', email):
            raise serializers.ValidationError({
                'fccu_email': 'Enter a valid FCCU student email.'
            })

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'fccu_email': 'User with this Email already exists.'})
        if StudentProfile.objects.filter(fccu_email__iexact=email).exists():
            raise serializers.ValidationError({'fccu_email': 'User with this Email already exists.'})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data.pop('fccu_email').lower()
        full_name = validated_data.pop('full_name').strip()
        password = validated_data.pop('password')
        otp = str(secrets.randbelow(900000) + 100000)

        name_parts = full_name.split(maxsplit=1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(username = email, email=email, password=password, first_name=first_name, last_name=last_name, is_active=False)

        StudentProfile.objects.create(user = user, fccu_email=email,otp=otp, otp_created_at=timezone.now())

        send_mail(
            subject='FCCU Lost & Found verification code',
            message=f'Your verification code is {otp}. It expires in 10 minutes.',
            from_email=None,
            recipient_list=[email],
            fail_silently=False,
        )

        return user

class VerifyOTPSerializer(serializers.Serializer):
        fccu_email = serializers.EmailField()
        otp =  serializers.RegexField(
                regex=r'^\d{6}$',
                error_messages={
                    'invalid': 'OTP must contain exactly 6 digits.'
                }
            )

        def validate(self,attrs):

            fccu_email = attrs.get('fccu_email')

            try:
                profile = StudentProfile.objects.get(fccu_email__iexact=fccu_email)

            except StudentProfile.DoesNotExist:
                raise serializers.ValidationError({
                    'fccu_email': 'No account exists with this email.'
                })

            if profile.is_verified:
                raise serializers.ValidationError({'fccu_email':'Profile Already Verified'})

            if not profile.is_otp_valid():
                raise serializers.ValidationError({
                    'otp': "OTP has expired."
                })

            if attrs.get('otp') != profile.otp:
                raise serializers.ValidationError({'otp' : 'Incorrect OTP.'})

            attrs['profile'] = profile
            return attrs


        def verify(self):
            profile = self.validated_data['profile']

            profile.is_verified = True
            profile.otp = None
            profile.otp_created_at = None
            profile.save()

            user = profile.user
            user.is_active = True
            user.save()

            return profile




class ResendOTPSerializer(serializers.Serializer):
    fccu_email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('fccu_email')

        try:
            profile = StudentProfile.objects.get(
                fccu_email__iexact=email
            )
        except StudentProfile.DoesNotExist:
            raise serializers.ValidationError({
                'fccu_email': 'No account exists with this email.'
            })

        if profile.is_verified:
            raise serializers.ValidationError({
                'fccu_email': 'This account is already verified.'
            })

        attrs['profile'] = profile
        return attrs

    def resend(self):
        profile = self.validated_data['profile']
        otp = str(secrets.randbelow(900000) + 100000)

        profile.otp = otp
        profile.otp_created_at = timezone.now()
        profile.save(update_fields=['otp', 'otp_created_at'])

        send_mail(
            subject='FCCU Lost & Found verification code',
            message=f'Your new verification code is {otp}. It expires in 10 minutes.',
            from_email=None,
            recipient_list=[profile.fccu_email],
            fail_silently=False,
        )

        return profile


