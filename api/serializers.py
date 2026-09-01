from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import UserProfile, Job, Resume, Education, Experience, Skill, UserType

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
    )
    user_type = serializers.CharField(
        source="profile.user_type",
        read_only=True,
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "user_type",
            "description"
        ]
        read_only_fields = ["id"]

        def validate(self, attrs):
            request = self.context.get('request')
            user_type = request.resolver_match.kwargs.get("user_type")

            if user_type not in UserType.values:
                raise serializers.ValidationError({
                    "user_type": "User must be a recruiter or an applicant."
                })

            attrs["profile_user_type"] = user_type
            return attrs

    @transaction.atomic
    def create(self, validated_data):
        user_type = validated_data.pop("profile_user_type")
        description = validated_data.pop("description", None)

        user = User.objects.create_user(**validated_data)

        UserProfile.objects.create(
            user=user,
            user_type = user_type,
            description = description
        )

        return user

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
