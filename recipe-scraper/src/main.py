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
@app.get('/analyze')
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
    description = formdata.get('description')
    score = get_confidence_score(description)
    if score < 7:
        followup = get_followup(description)
        return {
            
        }
