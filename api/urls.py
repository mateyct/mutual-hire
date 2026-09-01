from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    #path('test/', TestEndpointView.as_view(), name='test-endpoint'),
    path('auth/login', obtain_auth_token, name='login'),
]