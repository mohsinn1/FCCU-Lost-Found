from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.


class StudentProfile(models.Model):
    user =  models.OneToOneField(User,on_delete = models.CASCADE)
    fccu_email = models.EmailField(unique = True)
    is_verified = models.BooleanField(default = False)
    otp =  models.CharField(max_length = 6, blank = True, null = True)
    otp_created_at = models.DateTimeField(blank = True, null = True)

    def __str__(self):
        return self.fccu_email


    def is_otp_valid(self):
        if not self.otp or not self.otp_created_at:
            return False
        
        return self.otp_created_at + timedelta(minutes=10) > timezone.now()

