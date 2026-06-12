from rest_framework import serializers
from items.models import LostFoundItem


class LostFoundItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostFoundItem
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at','updated_at')

