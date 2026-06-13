from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView
from items.models import LostFoundItem
from items.serializers import LostFoundItemSerializer

# Create your views here.

class ItemListCreateView(ListCreateAPIView):
    queryset = LostFoundItem.objects.all().order_by('-created_at')
    serializer_class = LostFoundItemSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', '').strip()
        category = self.request.query_params.get('category', '').strip()
        search = self.request.query_params.get('search', '').strip()

        if status_filter:
            queryset = queryset.filter(status__iexact=status_filter)

        if category:
            queryset = queryset.filter(category__iexact=category)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(location__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ItemDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LostFoundItem.objects.all()
    serializer_class = LostFoundItemSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_object(self):
        item = super().get_object()
        if self.request.method not in SAFE_METHODS:
            if item.created_by != self.request.user:
                    raise PermissionDenied("You can only modify the items you uploaded")
        return item

class MyItemsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LostFoundItemSerializer
    def get_queryset(self):
        return LostFoundItem.objects.filter(created_by=self.request.user).order_by('-created_at')


class MarkClaimedView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        item = get_object_or_404(LostFoundItem, pk=pk)
        if item.created_by != request.user:
            raise PermissionDenied('You can only mark your own items as claimed.')
        if item.status == 'Claimed':
            return Response(
                {'message': 'This item is already claimed.'},status=status.HTTP_400_BAD_REQUEST,)

        item.status = 'Claimed'
        item.save(update_fields=['status'])

        serializer = LostFoundItemSerializer(item,context={'request': request},)
        return Response(serializer.data, status=status.HTTP_200_OK)

