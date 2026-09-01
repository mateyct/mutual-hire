from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import UserProfile, UserType, Job, Resume, Match
from rest_framework.response import Response
from rest_framework.views import APIView

from .matching import find_matching_jobs_for_resume, find_matching_resumes_for_job
from .models import Job, Resume, UserProfile, UserType
from .serializers import JobSerializer, RegisterSerializer, ResumeSerializer, UserProfileSerializer, MatchSerializer


def unauthorized(message):
    return Response({"detail": message}, status=status.HTTP_401_UNAUTHORIZED)


def auth_payload(user):
    token, _ = Token.objects.get_or_create(user=user)
    return {"token": token.key, "profile": UserProfileSerializer(user.profile).data}


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            raise serializers.ValidationError({"detail": "Both username and password are required."})
        user = authenticate(request=request, username=username, password=password)
        if user is None:
            return unauthorized("Invalid username or password.")
        if not hasattr(user, "profile"):
            return unauthorized("This user does not have an API profile.")
        return Response(auth_payload(user))


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_type):
        serializer = RegisterSerializer(data=request.data, context={"user_type": user_type})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(auth_payload(user), status=status.HTTP_201_CREATED)


class UserView(APIView):
    def get(self, request, user_id=None):
        if user_id is None:
            profile = get_object_or_404(UserProfile, user=request.user)
            if profile.user_type != UserType.APPLICANT:
                return unauthorized("Only applicants can retrieve their own profile here.")
        else:
            profile = get_object_or_404(UserProfile.objects.select_related("user"), user_id=user_id)
        return Response(UserProfileSerializer(profile).data)

    def delete(self, request, user_id=None):
        if user_id is not None:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserResumeView(APIView):
    def get(self, request, user_id):
        resume = get_object_or_404(
            Resume.objects.select_related("owner", "owner__profile"),
            owner_id=user_id,
            owner__profile__user_type=UserType.APPLICANT,
        )
        return Response(ResumeSerializer(resume).data)


class JobView(APIView):
    def get(self, request, job_id=None):
        if job_id is not None:
            return Response(JobSerializer(get_object_or_404(Job, pk=job_id)).data)
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.user_type != UserType.RECRUITER:
            return unauthorized("Only recruiters can list their jobs.")
        jobs = Job.objects.filter(company=request.user).order_by("id")
        return Response(JobSerializer(jobs, many=True).data)

    def post(self, request, job_id=None):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.user_type != UserType.RECRUITER:
            return unauthorized("Only recruiters can create or update jobs.")
        job = get_object_or_404(Job, pk=job_id, company=request.user) if job_id is not None else None
        serializer = JobSerializer(job, data=request.data, partial=job is not None)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK if job else status.HTTP_201_CREATED)

    def delete(self, request, job_id=None):
        if job_id is None:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        job = get_object_or_404(Job, pk=job_id, company=request.user)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResumeView(APIView):
    def get(self, request, resume_id=None):
        if resume_id is None:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return Response(ResumeSerializer(get_object_or_404(Resume, pk=resume_id)).data)

    def post(self, request, resume_id=None):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.user_type != UserType.APPLICANT:
            return unauthorized("Only applicants can create or update resumes.")
        if resume_id is None:
            if Resume.objects.filter(owner=request.user).exists():
                return Response({"detail": "This applicant already has a resume."}, status=status.HTTP_409_CONFLICT)
            resume = None
        else:
            resume = get_object_or_404(Resume, pk=resume_id, owner=request.user)
        serializer = ResumeSerializer(resume, data=request.data, partial=resume is not None)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK if resume else status.HTTP_201_CREATED)


class MatchingResumes(APIView):
    def get(self, request):
        job_id = request.query_params.get("job_id")
        if not job_id:
            raise serializers.ValidationError({"job_id": "This query parameter is required."})
        job = get_object_or_404(Job, pk=job_id)
        return Response(ResumeSerializer(find_matching_resumes_for_job(job), many=True).data)


class MatchingJobs(APIView):
    def get(self, request):
        resume_id = request.query_params.get("resume_id")
        if not resume_id:
            raise serializers.ValidationError(
                {"resume_id": "This query parameter is required."}
            )
        resume = get_object_or_404(Resume, pk=resume_id)
        return Response(
            JobSerializer(find_matching_jobs_for_resume(resume), many=True).data
        )

class SwipeView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        job_id = request.data.get('job_id')
        resume_id = request.data.get('resume_id')
        is_interested = request.data.get('is_interested')  # Expected: True or False

        if job_id is None or resume_id is None or is_interested is None:
            return Response(
                {"error": "job_id, resume_id, and is_interested are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        match_record, created = Match.objects.get_or_create(
            job_id=job_id, 
            resume_id=resume_id
        )

        user_profile = request.user.profile

        if user_profile.user_type == UserType.APPLICANT:
            if match_record.resume.owner != request.user:
                return Response({"error": "You don't own this resume."}, status=status.HTTP_403_FORBIDDEN)
            
            match_record.applicant_swiped_yes = is_interested

        elif user_profile.user_type == UserType.RECRUITER:
            if match_record.job.company != request.user:
                return Response({"error": "You don't own this job."}, status=status.HTTP_403_FORBIDDEN)
            
            match_record.employer_swiped_yes = is_interested

        match_record.save()

        is_mutual_match = (
            match_record.applicant_swiped_yes is True and 
            match_record.employer_swiped_yes is True
        )

        return Response({
            "message": "Swipe recorded successfully.",
            "is_mutual_match": is_mutual_match
        }, status=status.HTTP_200_OK)

class GetMatchesForJobView(APIView):
    def get(self, request, job_id):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.user_type != UserType.RECRUITER:
            return unauthorized("Only recruiters can search job matches.")

        job = get_object_or_404(Job, pk=job_id)
        if job.company != request.user:
            return Response({"error": "You don't own this job."}, status=status.HTTP_403_FORBIDDEN)

        return Response(
            MatchSerializer(Match.objects.filter(
                job=job,
                applicant_swiped_yes=True,
                employer_swiped_yes=True
            ), many=True).data, status=status.HTTP_200_OK
        )

class GetMatchesForResumeView(APIView):
    def get(self, request, resume_id):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.user_type != UserType.APPLICANT:
            return unauthorized("Only applicants can search job matches.")

        resume = get_object_or_404(Resume, pk=resume_id)
        if resume.owner != request.user:
            return Response({"error": "You don't own this resume."}, status=status.HTTP_403_FORBIDDEN)

        return Response(MatchSerializer(Match.objects.filter(
            resume=resume,
            applicant_swiped_yes=True,
            employer_swiped_yes=True
        ), many=True).data, status=status.HTTP_200_OK)
