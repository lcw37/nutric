from recipe_scrapers import scrape_html
import requests
import re


def get_nutrition_from_url(url: str, servings: float = 1.0):
    html = requests.get(url).content
    scraper = scrape_html(html, org_url=url)
    return {
        'ingredients': scraper.ingredients(),
        'nutrients': scraper.nutrients(),
    }
    
# print(get_nutrition_from_url('https://cafedelites.com/authentic-chimichurri-uruguay-argentina/'))


def parse_macro(text: str) -> list[int, str] | None:
    """
    possible structures for macro: '100g', '100 g', '100 g of protein'
    possible units: 'g', 'mg'
    """
    match = re.search(r'(\d+)\s*(g|mg)', text)
    if match:
        amount = int(match.group(1))
        unit = match.group(2)
        return [amount, unit]
    return None