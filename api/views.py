# from django.shortcuts import render
# from django.views.generic import Create
# from .models import UserProfile
# from rest_framework.authtoken.views import ObtainAuthToken
# from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from .serializers import RegisterSerializer

# Create your views here.
class RegisterView(CreateAPIView):
  serializer_class = RegisterSerializer
  permission_classes = [AllowAny]