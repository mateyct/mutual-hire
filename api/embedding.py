import os
from decouple import config
from openai import OpenAI

def generate_embedding(text: str) -> list:
    api_key = config("OPENAI_API_KEY")
    
    client = OpenAI(api_key=api_key)
    
    response = client.embeddings.create(
        input=[text],
        model="text-embedding-3-small"
    )
    return response.data[0].embedding