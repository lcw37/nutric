from . import prompts
import os
from openai import OpenAI
import json
from ..models import MealModel, NutritionBreakdown, EstimateFormData
from pydantic import ValidationError


client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
model = 'gpt-4o-mini'


def response(prompt: str) -> str:
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {'role': 'user', 'content': prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.0
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


def get_estimate(formdata: EstimateFormData) -> MealModel:
    description = formdata.description
    nutrient_fields = formdata.nutrient_fields
    followup = formdata.followup
    followup_response = formdata.followup_response
    
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
        title = r['title']
        estimate = NutritionBreakdown(**r['nutrition_breakdown'])
        return MealModel(
            title=title,
            nutrition_breakdown=estimate
        )
    except ValidationError as e:
        raise Exception(f'Estimate returned in invalid format.\n{e.errors()}')
    except Exception:
        raise Exception('Failed to get estimate.')

    