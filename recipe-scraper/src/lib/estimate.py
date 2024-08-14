from . import prompts
from dotenv import load_dotenv
import os
from openai import OpenAI
import json
from lib.typing import NutritionEstimate


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
    followup: str = None,
    followup_response: str = None
) -> NutritionEstimate:
    followup_info = ''
    if followup and followup_response:
        followup_info = prompts.followup_info_prompt.format(
            followup=followup, 
            followup_response=followup_response
        )
    p = prompts.estimate_prompt.format(
        description=description,
        followup_info=followup_info
    )
    try:
        r = response(p)
        r = json.loads(r)
        estimate = NutritionEstimate(**r)
        return estimate
    except Exception:
        raise Exception('Failed to get estimate.')
    

def run_estimate_process():
    description = input('DESCRIPTION: ')
    cs = get_confidence_score(description)
    if cs < 7:
        followup = get_followup(description)
        print('FOLLOWUP:', followup)
        followup_response = input('RESPONSE: ')
        estimate = get_estimate(description, followup, followup_response)
    else:
        estimate = get_estimate(description)
    print(estimate)
    
    