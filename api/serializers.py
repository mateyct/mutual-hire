from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import UserProfile, UserType

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