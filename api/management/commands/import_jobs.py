import csv
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Job, Skill, UserProfile, UserType


SKILLS_DELIMITER = '|'


def parse_skills(value):
    return [skill.strip() for skill in value.split(SKILLS_DELIMITER) if skill.strip()]

class Command(BaseCommand):
    help = 'Import realistic jobs from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        
        self.stdout.write("Starting job import. This may take a moment due to OpenAI embeddings...")

        with open(csv_file, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # 1. Create or get the Recruiter User
                user, user_created = User.objects.get_or_create(
                    username=row['username'],
                    defaults={'email': row['email']}
                )
                
                if user_created:
                    user.set_password('password123')
                    user.save()

                # 2. Create the Recruiter Profile (Requires company_name per your constraint!)
                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'user_type': UserType.RECRUITER
                    }
                )

                # 3. Create the Job
                job = Job.objects.create(
                    company=user,
                    title=row['title'],
                    location=row['location'],
                    pay=row['pay'],
                    type=row['type'],
                    description=row['description']
                )

                # Skills use | within the CSV cell so they do not conflict with
                # the CSV column delimiter.
                for skill_name in parse_skills(row.get('skills', '')):
                    Skill.objects.create(job=job, skill=skill_name)
                
                self.stdout.write(self.style.SUCCESS(f"Processed job: {row['title']} at {user.username}"))

        self.stdout.write(self.style.SUCCESS("CSV Job Import Complete!"))
