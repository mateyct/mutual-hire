from django.db import migrations
from pgvector.django import VectorExtension

class Migration(migrations.Migration):
    dependencies = [
        # Leave whatever dependency Django automatically put here intact
        ('api', '0001_initial'), 
    ]

    operations = [
        VectorExtension(),
    ]