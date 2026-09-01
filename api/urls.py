from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from .views import MatchingResumes

urlpatterns = [
    #path('test/', TestEndpointView.as_view(), name='test-endpoint'),
    path('auth/login', obtain_auth_token, name='login'),
    path('matching/resumes/', MatchingResumes.as_view(), name='matching_resumes'),
]