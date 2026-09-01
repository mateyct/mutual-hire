from pgvector.django import CosineDistance
from api.models import Resume, Job
from django.db.models import F, ExpressionWrapper, FloatField
from api.embedding import generate_embedding

EXP_WEIGHT = 0.4
SKILL_WEIGHT = 0.4
EDU_WEIGHT = 0.2


def find_matching_resumes_for_job(job:Job):
    if not job.description_embedding:
        return []

    ranked_resumes = Resume.objects.annotate(
        skill_dist=CosineDistance('skills_embedding', job.description_embedding),
        exp_dist=CosineDistance('experience_embedding', job.description_embedding),
        edu_dist=CosineDistance('education_embedding', job.description_embedding),
    ).annotate(
        composite_score=ExpressionWrapper(
            (F('skill_dist') * SKILL_WEIGHT) + (F('exp_dist') * EXP_WEIGHT) + (F('edu_dist') * EDU_WEIGHT),
            output_field=FloatField()
        )
    ).order_by('composite_score')[:10]  # lowest composite score = best match, batches of 10

    return ranked_resumes