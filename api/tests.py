from unittest.mock import patch

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Job, Resume, Skill, UserProfile, UserType

ZERO_VECTOR = [0.0] * 1536


class APITestBase(APITestCase):
    def setUp(self):
        embedding_patch = patch("api.models.generate_embedding", return_value=ZERO_VECTOR)
        embedding_patch.start()
        self.addCleanup(embedding_patch.stop)
        self.applicant = User.objects.create_user("applicant", password="StrongPass123!")
        UserProfile.objects.create(user=self.applicant, user_type=UserType.APPLICANT, description="Developer")
        self.recruiter = User.objects.create_user("recruiter", password="StrongPass123!")
        UserProfile.objects.create(user=self.recruiter, user_type=UserType.RECRUITER, description="Hiring team")
        self.other_recruiter = User.objects.create_user("other", password="StrongPass123!")
        UserProfile.objects.create(user=self.other_recruiter, user_type=UserType.RECRUITER)

    def authenticate(self, user):
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def create_job(self, owner=None):
        job = Job.objects.create(company=owner or self.recruiter, title="Backend Engineer", location="Remote", pay="95000.00", type=Job.EmploymentType.FULL_TIME, description="Build APIs")
        Skill.objects.create(job=job, skill="Python")
        return job

    def assert_no_embeddings(self, value):
        if isinstance(value, dict):
            for key, child in value.items():
                self.assertNotIn("embedding", key.lower())
                self.assert_no_embeddings(child)
        elif isinstance(value, list):
            for child in value:
                self.assert_no_embeddings(child)


class AuthenticationTests(APITestBase):
    def test_login_returns_token_and_complete_profile(self):
        response = self.client.post("/api/auth/login/", {"username": "applicant", "password": "StrongPass123!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["profile"]["user"]["username"], "applicant")
        self.assertEqual(response.data["profile"]["user_type"], UserType.APPLICANT)

    def test_registration_creates_profile_and_returns_token(self):
        response = self.client.post("/api/auth/register/applicant/", {"username": "new-user", "email": "new@example.com", "password": "UniquePass123!", "description": "New applicant"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["profile"]["user_type"], UserType.APPLICANT)


class UserEndpointTests(APITestBase):
    def test_user_detail_is_available_and_current_user_is_applicant_only(self):
        self.authenticate(self.recruiter)
        self.assertEqual(self.client.get(f"/api/user/{self.applicant.id}/").status_code, 200)
        self.assertEqual(self.client.get("/api/user/").status_code, 401)

    def test_delete_current_user_cascades_profile(self):
        user_id = self.applicant.id
        self.authenticate(self.applicant)
        self.assertEqual(self.client.delete("/api/user/").status_code, 204)
        self.assertFalse(User.objects.filter(pk=user_id).exists())
        self.assertFalse(UserProfile.objects.filter(user_id=user_id).exists())

    def test_user_resume_returns_404_for_recruiter(self):
        self.authenticate(self.applicant)
        self.assertEqual(self.client.get(f"/api/user/{self.recruiter.id}/resume/").status_code, 404)


class JobEndpointTests(APITestBase):
    def test_recruiter_can_create_list_update_and_delete_job_with_skills(self):
        self.authenticate(self.recruiter)
        payload = {"title": "API Engineer", "location": "Denver", "pay": "100000.00", "type": "full_time", "description": "Develop services", "skills": ["Python", "Django"]}
        created = self.client.post("/api/job/", payload, format="json")
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data["skills"], ["Python", "Django"])
        self.assert_no_embeddings(created.data)
        self.assertEqual(len(self.client.get("/api/job/").data), 1)
        updated = self.client.post(f"/api/job/{created.data['id']}/", {"skills": ["REST"]}, format="json")
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data["skills"], ["REST"])
        self.assertEqual(self.client.delete(f"/api/job/{created.data['id']}/").status_code, 204)

    def test_non_owner_cannot_update_or_delete_job(self):
        job = self.create_job()
        self.authenticate(self.other_recruiter)
        self.assertEqual(self.client.post(f"/api/job/{job.id}/", {"title": "Stolen"}, format="json").status_code, 404)
        self.assertEqual(self.client.delete(f"/api/job/{job.id}/").status_code, 404)

    def test_applicant_job_list_is_unauthorized(self):
        self.authenticate(self.applicant)
        self.assertEqual(self.client.get("/api/job/").status_code, 401)


class ResumeEndpointTests(APITestBase):
    def resume_payload(self):
        return {
            "summary": "Backend developer",
            "experience": [{"title": "Engineer", "company": "Acme", "start_date": "2024-01-01", "end_date": None, "current_job": True, "description": "Built APIs", "type": "job"}],
            "education": [{"title": "State University", "degree": "BS", "major": "Computer Science", "gpa": "3.75", "start_date": "2020-09-01", "end_date": "2024-05-01", "description": ""}],
            "skills": ["Python", "Django"],
        }

    def test_applicant_can_create_retrieve_and_partially_update_resume(self):
        self.authenticate(self.applicant)
        created = self.client.post("/api/resume/", self.resume_payload(), format="json")
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data["skills"], ["Python", "Django"])
        self.assert_no_embeddings(created.data)
        retrieved = self.client.get(f"/api/resume/{created.data['id']}/")
        self.assertEqual(retrieved.status_code, 200)
        self.assertEqual(len(retrieved.data["experience"]), 1)
        updated = self.client.post(f"/api/resume/{created.data['id']}/", {"summary": "Updated"}, format="json")
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data["summary"], "Updated")

    def test_resume_update_is_owner_only(self):
        resume = Resume.objects.create(owner=self.applicant, summary="Mine")
        second = User.objects.create_user("second", password="StrongPass123!")
        UserProfile.objects.create(user=second, user_type=UserType.APPLICANT)
        self.authenticate(second)
        self.assertEqual(self.client.post(f"/api/resume/{resume.id}/", {"summary": "Stolen"}, format="json").status_code, 404)


class MatchingEndpointTests(APITestBase):
    def test_matching_validates_query_params_and_never_returns_embeddings(self):
        job = self.create_job()
        resume = Resume.objects.create(owner=self.applicant, summary="Engineer")
        self.authenticate(self.applicant)
        self.assertEqual(self.client.get("/api/matching/jobs/").status_code, 400)
        with patch("api.views.find_matching_jobs_for_resume", return_value=[job]):
            response = self.client.get(f"/api/matching/jobs/?resume_id={resume.id}")
        self.assertEqual(response.status_code, 200)
        self.assert_no_embeddings(response.data)
