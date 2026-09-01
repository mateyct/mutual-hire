from django.db.models.signals import post_save, post_delete, pre_delete
from django.dispatch import receiver
from .models import Education, Experience, Skill, Resume

# Tracks IDs of resumes currently being deleted so we don't spam OpenAI
DELETING_RESUME_IDS = set()

@receiver(pre_delete, sender=Resume)
def flag_resume_deletion(sender, instance, **kwargs):
    DELETING_RESUME_IDS.add(instance.id)

@receiver(post_delete, sender=Resume)
def cleanup_resume_deletion_flag(sender, instance, **kwargs):
    DELETING_RESUME_IDS.discard(instance.id)

@receiver([post_save, post_delete], sender=Education)
def update_education_vector(sender, instance, **kwargs):
    if instance.resume_id not in DELETING_RESUME_IDS:
        try:
            instance.resume.update_section_embedding("education")
        except Resume.DoesNotExist:
            pass

@receiver([post_save, post_delete], sender=Experience)
def update_experience_vector(sender, instance, **kwargs):
    if instance.resume_id not in DELETING_RESUME_IDS:
        try:
            instance.resume.update_section_embedding("experience")
        except Resume.DoesNotExist:
            pass

@receiver([post_save, post_delete], sender=Skill)
def update_skills_vector(sender, instance, **kwargs):
    if instance.resume_id and instance.resume_id not in DELETING_RESUME_IDS:
        try:
            instance.resume.update_section_embedding("skills")
        except Resume.DoesNotExist:
            pass