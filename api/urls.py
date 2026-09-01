from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from .views import RegisterView, MatchingResumes, JobView

urlpatterns = [
    #path('test/', TestEndpointView.as_view(), name='test-endpoint'),
    path('auth/login/', obtain_auth_token, name='login'),
    path('auth/register/<str:user_type>/', RegisterView.as_view(), name="register"),
    path('job/', JobView.as_view(), name="jobs"),
    path('job/<int:job_id>/', JobView.as_view(), name="job-detail"),
    path('matching/resumes/<int:job_id>', MatchingResumes.as_view(), name='matching_resumes'),
]
