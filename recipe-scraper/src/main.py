from .lib.setup import _

from recipe_scrapers import WebsiteNotImplementedError
from fastapi import (
    FastAPI, 
    HTTPException,
)

from .lib.models import EstimateFormData, RecipeFormData, EstimateResponse
from .lib.estimate.estimate import (
    get_confidence_score,
    get_followup,
    get_estimate
)
from .lib.estimate.recipes import get_nutrition_from_url

if _: # see /lib/setup.py, this is just to fix a linting warning
    pass

app = FastAPI()


@app.get('/ping')
async def ping():
    print('pinged from frontend')
    return {
        'message': 'pong'
    }


@app.post('/estimate')
async def estimate(formdata: EstimateFormData) -> EstimateResponse:
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
        return EstimateResponse(**{
            'response_type': 'estimateFromDescription',
            'data': formdata,
            'estimate': estimate
        })
    except Exception:
        raise HTTPException(500, 'Failed to create estimate.')


@app.post('/recipe')
async def recipe(formdata: RecipeFormData) -> EstimateResponse:
    try:
        url = str(formdata.recipe_url)
        nutrition_breakdown = get_nutrition_from_url(url)
        return EstimateResponse(**{
            'response_type': 'estimateFromRecipe',
            'data': formdata,
            'estimate': nutrition_breakdown
        })
    except WebsiteNotImplementedError:
        raise HTTPException(400, f'Website not supported: {url}')