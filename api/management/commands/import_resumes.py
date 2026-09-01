import csv
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, UserType, Resume, Skill, Experience, Education

class Command(BaseCommand):
    help = 'Import realistic resumes from a CSV file'

    def add_arguments(self, parser):
        # Allows you to pass the filename when running the command
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        
        self.stdout.write("Starting import. This may take a moment due to OpenAI embeddings...")

        with open(csv_file, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # 1. Create User
                user, user_created = User.objects.get_or_create(
                    username=row['username'],
                    defaults={
                        'first_name': row['first_name'],
                        'last_name': row['last_name'],
                        'email': row['email'],
                    }
                )
                
                if user_created:
                    user.set_password('password123')
                    user.save()

                # 2. Create UserProfile
                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={'user_type': UserType.APPLICANT}
                )

                # 3. Create Resume
                resume, res_created = Resume.objects.get_or_create(
                    owner=user,
                    defaults={'summary': row['summary']}
                )

                # 4. Create Skills (Splits the comma-separated string)
                if row.get('skills'):
                    skills_list = [s.strip() for s in row['skills'].split(',') if s.strip()]
                    for skill_name in skills_list:
                        Skill.objects.get_or_create(resume=resume, skill=skill_name)
                
                # 5. Create Experience
                if row.get('exp_title'):
                    Experience.objects.get_or_create(
                        resume=resume,
                        title=row['exp_title'],
                        defaults={
                            'company': row.get('exp_company', ''),
                            'start_date': row.get('exp_start', '2020-01-01'),
                            'current_job': True,
                            'description': row.get('exp_desc', ''),
                            'type': Experience.ExperienceType.JOB
                        }
                    )
                    
                # 6. Create Education
                if row.get('edu_title'):
                    Education.objects.get_or_create(
                        resume=resume,
                        title=row['edu_title'],
                        defaults={
                            'degree': row.get('edu_degree', 'BS'),
                            'major': row.get('edu_major', 'Computer Science'),
                            'start_date': row.get('edu_start', '2016-01-01'),
                            'description': row.get('edu_desc', '')
                        }
                    )
                
                self.stdout.write(self.style.SUCCESS(f"Processed applicant: {user.username}"))

        self.stdout.write(self.style.SUCCESS("CSV Import Complete!"))