from fastapi import (
    FastAPI, 
)
from recipe_scrapers import scrape_html
import requests

from lib.estimate import (
    get_confidence_score,
    get_followup,
    get_estimate
)
from lib.models import EstimateFormData


app = FastAPI()

# @app.post("/analyze")
# async def analyze(url: str):
@app.get('/scraper')
async def analyze():
    url = 'https://cafedelites.com/authentic-chimichurri-uruguay-argentina/'
    html = requests.get(url).content
    scraper = scrape_html(html, org_url=url)
    return {
        'ingredients': scraper.ingredients(),
        'nutrients': scraper.nutrients()
    }


@app.post('/estimate')
async def estimate(formdata: EstimateFormData):
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
        'data': estimate
    }