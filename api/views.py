from django.shortcuts import render
from django.views.generic import DetailView
from .models import UserProfile
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

# Create your views here.
# class GetUserProfile(DetailView):
    