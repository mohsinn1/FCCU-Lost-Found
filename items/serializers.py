from rest_framework import serializers
from items.models import LostFoundItem


class LostFoundItemSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    created_by_email = serializers.EmailField(
        source='created_by.email',
        read_only=True,
    )
    contact_info = serializers.RegexField(
        regex=r'^\d{11}$',
        error_messages={
            'invalid': 'Contact number must contain exactly 11 digits.',
        },
    )

    class Meta:
        model = LostFoundItem
        fields = '__all__'
        read_only_fields = (
            'created_by',
            'created_at',
            'updated_at',
        )

    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() or obj.created_by.username

    def validate_status(self, value):
        if value == 'Claimed':
            raise serializers.ValidationError(
                'Use the mark-claimed endpoint to claim an item.'
            )
        return value

