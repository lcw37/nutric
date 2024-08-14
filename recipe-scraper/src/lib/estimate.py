from . import prompts
from dotenv import load_dotenv
import os
from openai import OpenAI
import json


load_dotenv()
client = OpenAI()
client.api_key = os.environ['OPENAI_API_KEY']
model = 'gpt-4o-mini'


def response(prompt: str) -> str:
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {'role': 'user', 'content': prompt}
        ]
    )
    return completion.choices[0].message.content


def get_confidence_score(description: str) -> int:
    p = prompts.confidence_score_prompt.format(description=description)
    try:
        r = response(p)
        r = json.loads(r)
        confidence_score = int(r.get('confidence_score'))
        return confidence_score
    except Exception:
        raise Exception('Failed to create confidence score.')


def get_followup(description: str) -> str:
    p = prompts.followup_prompt.format(description=description)
    try:
        r = response(p)
        r = json.loads(r)
        followup = r.get('followup')
        return followup
    except Exception:
        raise Exception('Failed to get followup.')


def get_estimate(
    description: str, 
    followup: str,
    followup_response: str
) -> dict:
    p = prompts.estimate_prompt.format(
        description=description,
        followup=followup,
        followup_response=followup_response
    )
    try:
        r = response(p)
        r = json.loads(r)
        estimate: dict = r
        return estimate
    except Exception:
        raise Exception('Failed to get estimate.')


# print('confidence_score:', get_confidence_score(prompts.sample_description))
# print('followup:', get_followup(prompts.sample_description))
# print('estimate:', get_estimate(
#     prompts.sample_description,
#     prompts.sample_followup,
#     prompts.sample_followup_response
# ))