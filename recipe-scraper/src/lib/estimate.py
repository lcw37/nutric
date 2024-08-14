from . import prompts
from dotenv import load_dotenv
import os
from openai import OpenAI
import json
from lib.models import NutritionValues, EstimateFormData
from pydantic import ValidationError


load_dotenv()
client = OpenAI()
client.api_key = os.environ['OPENAI_API_KEY']
model = 'gpt-4o-mini'


def response(prompt: str) -> str:
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {'role': 'user', 'content': prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0
    )
    return completion.choices[0].message.content


def get_confidence_score(formdata: EstimateFormData) -> int:
    description = formdata.get('description')
    p = prompts.confidence_score_prompt.format(description=description)
    try:
        r = response(p)
        r = json.loads(r)
        confidence_score = int(r.get('confidence_score'))
        return confidence_score
    except Exception:
        raise Exception('Failed to create confidence score.')


def get_followup(formdata: EstimateFormData) -> str:
    description = formdata.get('description')
    p = prompts.followup_prompt.format(description=description)
    try:
        r = response(p)
        r = json.loads(r)
        followup = r.get('followup')
        return followup
    except Exception:
        raise Exception('Failed to get followup.')


def get_estimate(formdata: EstimateFormData) -> NutritionValues:
    description = formdata.get('description')
    nutrient_fields = formdata.get('nutrient_fields')
    followup = formdata.get('followup')
    followup_response = formdata.get('followup_response')
    
    followup_info = ''
    if followup and followup_response:
        followup_info = prompts.followup_info_prompt.format(
            followup=followup, 
            followup_response=followup_response
        )
    p = prompts.estimate_prompt.format(
        description=description,
        followup_info=followup_info,
        nutrient_fields=nutrient_fields
    )
    try:
        r = response(p)
        r = json.loads(r)
        estimate = NutritionValues(**r)
        return estimate
    except ValidationError as e:
        raise Exception(f'Estimate returned in invalid format.\n{e.errors()}')
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
    
    