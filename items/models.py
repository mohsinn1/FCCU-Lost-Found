from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class LostFoundItem(models.Model):
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('ID', 'ID'),
        ('Wallet', 'Wallet'),
        ('Keys', 'Keys'),
        ('Bag', 'Bag'),
        ('Other', 'Other')]

    STATUS_CHOICES = [
        ('Lost', 'Lost'),
        ('Found', 'Found'),
        ('Claimed', 'Claimed')]

    title = models.CharField(max_length=50)
    category = models.CharField(max_length=20,choices= CATEGORY_CHOICES)
    description = models.TextField(max_length=200)
    location = models.CharField(max_length=50)
    date_lost_found = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    contact_info = models.CharField(max_length=11)
    image = models.ImageField(upload_to='items/')
    created_by = models.ForeignKey(User,on_delete = models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
