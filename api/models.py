from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Job(models.Model):
    class EmploymentType(models.TextChoices):
        INTERNSHIP = "internship", "Internship"
        PART_TIME = "part_time", "Part-time"
        FULL_TIME = "full_time", "Full-time"

    title = models.CharField(max_length=255)
    company = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobs",
    )
    location = models.CharField(max_length=255)
    pay = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=16, choices=EmploymentType.choices)
    description = models.TextField()


class Resume(models.Model):
    summary = models.TextField()


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    is_recruiter = models.BooleanField(default=False)
    company_name = models.CharField(max_length=255, blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(is_recruiter=False)
                    | ~models.Q(company_name="")
                ),
                name="recruiter_requires_company_name",
            ),
        ]


class Education(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="education",
    )
    title = models.CharField(max_length=255)
    degree = models.CharField(max_length=100)
    major = models.CharField(max_length=255)
    gpa = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(4)],
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)


class Experience(models.Model):
    class ExperienceType(models.TextChoices):
        JOB = "job", "Job"
        PROJECT = "project", "Project"

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="experiences",
    )
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    current_job = models.BooleanField(default=False)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=7, choices=ExperienceType.choices)


class Skill(models.Model):
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="skills",
        null=True,
        blank=True,
    )
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="skills",
        null=True,
        blank=True,
    )
    skill = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(job__isnull=False, resume__isnull=True)
                    | models.Q(job__isnull=True, resume__isnull=False)
                ),
                name="skill_has_exactly_one_owner",
            ),
        ]
