from fastapi import (
    APIRouter,
    Body,
    HTTPException
)
from ..lib.models import (
    EstimateFormData, 
    RecipeFormData, 
    EstimateResponse,
)
from ..lib.estimate.estimate import (
    get_confidence_score,
    get_followup,
    get_estimate
)
from ..lib.estimate.recipes import get_nutrition_from_url
from recipe_scrapers import WebsiteNotImplementedError


router = APIRouter(prefix="/calculator")

@router.post('/from-description')
async def estimate(formdata: EstimateFormData = Body(...)) -> EstimateResponse:
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


@router.post('/from-recipe')
async def recipe(formdata: RecipeFormData = Body(...)) -> EstimateResponse:
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