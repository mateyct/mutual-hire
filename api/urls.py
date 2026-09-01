from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from .views import RegisterView

urlpatterns = [
    #path('test/', TestEndpointView.as_view(), name='test-endpoint'),
    path('auth/login/', obtain_auth_token, name='login'),
    path('auth/register/<str:user_type>/', RegisterView.as_view(), name="register")
]