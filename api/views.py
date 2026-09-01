# from django.shortcuts import render
# from django.views.generic import Create
# from .models import UserProfile
# from rest_framework.authtoken.views import ObtainAuthToken
# from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from django.shortcuts import render
from django.views.generic import DetailView
from .models import UserProfile
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .matching import find_matching_resumes_for_job, find_matching_jobs_for_resume
from .serializers import ResumeSerializer, JobSerializer, RegisterSerializer
from .models import Job, Resume

# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class MatchingResumes(APIView):
    def get(self, request):
        job_id = request.query_params.get('job_id')

        job = Job.objects.get(pk=job_id)

        ranked_resumes = find_matching_resumes_for_job(job)

        serializer = ResumeSerializer(ranked_resumes, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class MatchingJobs(APIView):
    def get(self, request):
        resume_id = request.query_params.get('resume_id')

        resume = Resume.objects.get(pk=resume_id)

        ranked_jobs = find_matching_jobs_for_resume(resume)

        serializer = JobSerializer(ranked_jobs, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)