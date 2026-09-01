from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from pgvector.django import VectorField
from .embedding import generate_embedding


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
        db_column="user_id"
    )
    location = models.CharField(max_length=255)
    pay = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=16, choices=EmploymentType.choices)
    description = models.TextField()


class Resume(models.Model):
    summary = models.TextField()
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="resumes",
        null=True
    )

    skills_embedding = VectorField(dimensions=1536, null=True, blank=True)
    experience_embedding = VectorField(dimensions=1536, null=True, blank=True)
    education_embedding = VectorField(dimensions=1536, null=True, blank=True)

    def update_section_embedding(self, section_name: str):
        combined_text = ""
        field_to_update = f"{section_name}_embedding"

        if section_name == "skills":
            skills_list = [
                f"{e.skill}, " 
                for e in self.skills.all()
            ]
            if not skills_list:
                setattr(self, field_to_update, None)
                self.save(update_fields=[field_to_update])
                return
            combined_text = "Skills:\n" + "\n".join(skills_list)
        if section_name == "experience":
            exp_list = [
                f"{e.title} at {e.company}. Details: {e.description}" 
                for e in self.experiences.all()
            ]
            if not exp_list:
                setattr(self, field_to_update, None)
                self.save(update_fields=[field_to_update])
                return
            combined_text = "Experience:\n" + "\n".join(exp_list)
        if section_name == "education":
            edu_list = [
                f"{e.degree} in {e.major} at {e.title}. Details: {e.description}" 
                for e in self.education.all()
            ]
            if not edu_list:
                setattr(self, field_to_update, None)
                self.save(update_fields=[field_to_update])
                return
            combined_text = "Education History:\n" + "\n".join(edu_list)

        if combined_text:
            vector = generate_embedding(combined_text)
            setattr(self, field_to_update, vector)
            self.save(update_fields=[field_to_update])


class UserType(models.TextChoices):
    RECRUITER = "recruiter", "Recruiter"
    APPLICANT = "applicant", "Applicant"

class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    user_type = models.CharField(max_length=16, choices=UserType.choices, default=UserType.RECRUITER)
    description = models.TextField(
        null=True
    )

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
