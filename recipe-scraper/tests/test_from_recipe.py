from src.lib.recipes import (
    get_nutrition_from_url, 
    parse_macro
)

def test_scraper():
    url = 'https://cafedelites.com/authentic-chimichurri-uruguay-argentina/'
    servings = 1.0
    get_nutrition_from_url(url, servings)
    pass

def test_parse_macro():
    assert parse_macro('100 g') == [100, 'g']
    assert parse_macro('100 mg') == [100, 'mg']
    assert parse_macro('100g') == [100, 'g']
    assert parse_macro('100mg') == [100, 'mg']
    assert parse_macro('100 g of protein') == [100, 'g']
    assert parse_macro('100 mg of sodium') == [100, 'mg']