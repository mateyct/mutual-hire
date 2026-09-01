# from django.shortcuts import render
# from django.views.generic import Create
# from .models import UserProfile
# from rest_framework.authtoken.views import ObtainAuthToken
# from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from django.shortcuts import render, get_object_or_404
from django.views.generic import DetailView
from .models import UserProfile, UserType, Job, Resume
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from .serializers import ResumeSerializer, RegisterSerializer, JobSerializer
from .matching import find_matching_resumes_for_job, find_matching_jobs_for_resume

# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class JobView(APIView):
    def get(self, request, job_id=None):
        job = get_object_or_404(Job, pk=job_id)

        serializer = JobSerializer(job)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, job_id=None):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.user_type != UserType.RECRUITER:
            return Response(
                {"message": "Must be a recruiter to update a job"},
                status=status.HTTP_403_FORBIDDEN,
            )

        job = None
        if job_id is not None:
            job = get_object_or_404(Job, pk=job_id)

        if job is None:
            serializer = JobSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(company=request.user)
        else:
            serializer = JobSerializer(
                job,
                data=request.data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(company=request.user)

        response_status = status.HTTP_200_OK if job is not None else status.HTTP_201_CREATED
        return Response(serializer.data, status=response_status)

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