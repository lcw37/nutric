from fastapi import (
    FastAPI, 
)
from recipe_scrapers import scrape_html
import requests


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


