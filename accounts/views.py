from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status, request
from .serializers import RegisterSerializer, VerifyOTPSerializer, ResendOTPSerializer, LoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated


# Create your views here.

class RegisterView(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
    {'message': 'Registration successful. Check the server console for your OTP.'},
        status=status.HTTP_201_CREATED)


class VerifyOTPView(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.verify()
        return Response({'message': 'OTP Verification Successful.'}, status=status.HTTP_200_OK)

class ResendOTPView(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.resend()
        return Response({'message': 'OTP Resent Successfully.'}, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'full_name' : user.get_full_name(), 'email' : user.email}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request):
        request.auth.delete()
        return Response({'message': 'Logout Successful.'}, status=status.HTTP_200_OK)