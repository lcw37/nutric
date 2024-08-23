from recipe_scrapers import scrape_html
import requests
import re
from ..models import MealModel, NutritionBreakdown


def get_nutrition_from_url(
    url: str, 
    nutrient_fields: list[str] | None = None, 
) -> MealModel:
    html = requests.get(url).content
    scraper = scrape_html(html, org_url=url, supported_only=True)
    nutrients = scraper.nutrients()
    
    parsed_nutrients = {}
    if nutrient_fields is None:
        nutrient_fields = list(nutrients.keys())
    for k in nutrient_fields:

        if k == 'servingSize': # ignore servingSize
            continue
        
        amount, unit = parse_macro(nutrients[k])
        
        if k[-7:] == 'Content': # strip 'Content' from the end
            k = k[:-7]
        
        if k == 'carbohydrate':
            k = 'carbs'
            
        parsed_nutrients[k] = {'min': amount, 'max': amount,'unit': unit}
    return MealModel(
        title=scraper.title(),
        nutrition_breakdown=NutritionBreakdown(**parsed_nutrients)
    )


def parse_macro(text: str) -> list[float, str] | str | None:
    """
    possible structures for macro: '100g', '100 g', '100 g of protein'
    possible units: 'g', 'mg', 'cal', 'kcal'
    returns: [100, 'g'/'mg'/'cal']
    """
    match = re.search(r'(\d+)\s*(g|mg|cal|kcal)', text)
    if match:
        amount = float(match.group(1))
        unit = match.group(2)
        if unit == 'kcal':
            unit = 'cal'
        return [amount, unit]
    return [1.0, text]