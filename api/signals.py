from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Education, Experience, Skill

@receiver([post_save, post_delete], sender=Education)
def update_education_vector(sender, instance, **kwargs):
    instance.resume.update_section_embedding("education")

@receiver([post_save, post_delete], sender=Experience)
def update_experience_vector(sender, instance, **kwargs):
    instance.resume.update_section_embedding("experience")

@receiver([post_save, post_delete], sender=Skill)
def update_skills_vector(sender, instance, **kwargs):
    instance.resume.update_section_embedding("skills")