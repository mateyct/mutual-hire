import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, UserType, Resume, Skill, Experience, Education
from faker import Faker

class Command(BaseCommand):
    help = 'Seeds the database with 20 applicant users and complete resumes'

    def handle(self, *args, **kwargs):
        fake = Faker()
        tech_skills = ["Python", "Django", "React", "PostgreSQL", "Docker", "AWS", "JavaScript", "C++", "Java", "Go", "Kubernetes", "Redis"]
        majors = ["Computer Science", "Software Engineering", "Information Technology", "Mathematics"]
        

        self.stdout.write("Starting to seed 20 users. This will take a minute due to OpenAI API calls...")

        for i in range(20):
            # 1. Create User
            first_name = fake.first_name()
            last_name = fake.last_name()
            username = f"{first_name.lower()}{last_name.lower()}{random.randint(10, 99)}"
            
            user = User.objects.create_user(
                username=username,
                email=fake.email(),
                password="password123",
                first_name=first_name,
                last_name=last_name
            )

            # 2. Create UserProfile
            UserProfile.objects.create(
                user=user,
                user_type=UserType.APPLICANT,
                description=fake.sentence()
            )

            # 3. Create Resume (Triggers summary_embedding generation)
            resume = Resume.objects.create(
                owner=user,
                summary=f"Experienced professional with a background in software development. {fake.paragraph(nb_sentences=2)}"
            )

            # 4. Create Skills (Triggers skills_embedding generation via signal)
            selected_skills = random.sample(tech_skills, 3)
            for skill_name in selected_skills:
                Skill.objects.create(resume=resume, skill=skill_name)

            # 5. Create Experience (Triggers experience_embedding generation via signal)
            Experience.objects.create(
                resume=resume,
                title=fake.job(),
                company=fake.company(),
                start_date=fake.date_between(start_date='-5y', end_date='-1y'),
                current_job=True,
                description=fake.paragraph(nb_sentences=3),
                type=Experience.ExperienceType.JOB
            )

            # 6. Create Education (Triggers education_embedding generation via signal)
            Education.objects.create(
                resume=resume,
                title=fake.word(),
                degree="Bachelor of Science",
                major=random.choice(majors),
                gpa=round(random.uniform(3.0, 4.0), 2),
                start_date=fake.date_between(start_date='-10y', end_date='-6y'),
                end_date=fake.date_between(start_date='-6y', end_date='-5y'),
                description="Graduated with honors."
            )

            self.stdout.write(self.style.SUCCESS(f"Successfully created applicant {i+1}/20: {username}"))

        self.stdout.write(self.style.SUCCESS("All 20 resumes seeded successfully!"))