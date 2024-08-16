from recipe_scrapers import WebsiteNotImplementedError
from fastapi import (
    FastAPI, 
    HTTPException,
)

from .lib.models import EstimateFormData, RecipeFormData
from .lib.estimate import (
    get_confidence_score,
    get_followup,
    get_estimate
)
from .lib.recipes import get_nutrition_from_url



app = FastAPI()


@app.get('/ping')
async def ping():
    print('pinged from frontend')
    return {
        'message': 'pong'
    }

@app.post('/recipe')
async def recipe(formdata: RecipeFormData):
    try:
        url = str(formdata.recipe_url)
        nutrition_breakdown = get_nutrition_from_url(url)
        return {
            'nutrients': nutrition_breakdown
        }
    except WebsiteNotImplementedError:
        raise HTTPException(400, f'Website not supported: {url}')

@app.post('/estimate')
async def estimate(formdata: EstimateFormData):
    if (formdata.followup and not formdata.followup_response) or (not formdata.followup and formdata.followup_response):
        raise HTTPException(400, 'Missing followup or response.')
    
    try:
        cs = get_confidence_score(formdata.description)
        if not formdata.followup:
            if cs < 7:
                formdata.followup = get_followup(formdata.description)
                return {
                    'response_type': 'followup',
                    'data': formdata
                }
        estimate = get_estimate(formdata)
        return {
            'response_type': 'estimate',
            'data': formdata,
            'estimate': estimate
        }
    except Exception:
        raise HTTPException(500, 'Failed to create estimate.')