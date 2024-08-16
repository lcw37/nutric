from fastapi import (
    FastAPI, 
    HTTPException,
    Request
)
from recipe_scrapers import scrape_html
import requests
from lib.estimate import (
    get_confidence_score,
    get_followup,
    get_estimate
)
from lib.models import EstimateFormData, RecipeFormData


app = FastAPI()


@app.get('/ping')
async def ping():
    print('pinged from frontend')
    return {
        'message': 'pong'
    }

@app.post('/recipe')
async def recipe(formdata: RecipeFormData):
    url = str(formdata.recipe_url)
    print(url)
    html = requests.get(url).content
    scraper = scrape_html(html, org_url=url)
    nutrients = {}
    for n in scraper.nutrients():
        val, unit = scraper.nutrients()[n].split(' ')
        val = float(val)
        minmaxpair = {'val': val, 'unit': unit}
        nutrients[n] = minmaxpair
    return {
        'ingredients': scraper.ingredients(),
        'nutrients': nutrients
    }


@app.post('/estimate')
async def estimate(formdata: EstimateFormData):
    if (formdata.followup and not formdata.followup_response) or (not formdata.followup and formdata.followup_response):
        raise HTTPException(400, 'Missing followup or response.')
    cs = get_confidence_score(formdata.description)
    if not formdata.followup:
        if cs < 7:
            formdata.followup = get_followup(formdata.description)
            return {
                'response_type': 'followup',
                'data': formdata
            }
    print('GETTING ESTIMATE')
    estimate = get_estimate(formdata)
    return {
        'response_type': 'estimate',
        'data': formdata,
        'estimate': estimate
    }