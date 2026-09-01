from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Job, Resume, Education, Experience, Skill


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'user_type', 'company_name', 'description']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'skill', 'job', 'resume']
        extra_kwargs = {
            'job': {'required': False, 'allow_null': True},
            'resume': {'required': False, 'allow_null': True},
        }


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'resume', 'title', 'degree', 'major', 
            'gpa', 'start_date', 'end_date', 'description'
        ]
        extra_kwargs = {'resume': {'required': False}}


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'resume', 'title', 'company', 'start_date', 
            'current_job', 'end_date', 'description', 'type'
        ]
        extra_kwargs = {'resume': {'required': False}}


class ResumeSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    skills = SkillSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'owner', 'summary', 
            'skills', 'experiences', 'education',
            'skills_embedding', 'experience_embedding', 
            'education_embedding', 'summary_embedding'
        ]
        read_only_fields = [
            'skills_embedding', 'experience_embedding', 
            'education_embedding', 'summary_embedding'
        ]


class JobSerializer(serializers.ModelSerializer):
    company = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'location', 
            'pay', 'type', 'description', 'skills',
            'description_embedding'
        ]
        read_only_fields = ['description_embedding']