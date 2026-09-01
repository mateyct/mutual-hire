from django.contrib import admin
from .models import Experience, Education, Skill, Resume, Job, UserProfile

admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Skill)
admin.site.register(Resume)
admin.site.register(Job)
admin.site.register(UserProfile)