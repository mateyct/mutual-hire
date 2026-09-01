from django.shortcuts import render
from django.views.generic import DetailView
from .models import UserProfile
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .matching import find_matching_resumes_for_job
from .serializers import ResumeSerializer
from .models import Job

# Create your views here.
# class GetUserProfile(DetailView):
    
class MatchingResumes(APIView):
    def get(self, request):
        job_id = request.query_params.get('job_id')

        job = Job.objects.get(pk=job_id)

        ranked_resumes = find_matching_resumes_for_job(job)

        serializer = ResumeSerializer(ranked_resumes, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)