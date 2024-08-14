from src.lib.recipes import (
    get_nutrition_from_url, 
    parse_macro
)

def test_scraper():
    url = 'https://cafedelites.com/authentic-chimichurri-uruguay-argentina/'
    servings = 1.0
    result = get_nutrition_from_url(url=url, servings=servings)
    print(result)
    pass

def test_parse_macro():
    assert parse_macro('100 g') == [100, 'g']
    assert parse_macro('100 mg') == [100, 'mg']
    assert parse_macro('100 cal') == [100, 'cal']
    assert parse_macro('100 kcal') == [100, 'cal']
    assert parse_macro('100g') == [100, 'g']
    assert parse_macro('100mg') == [100, 'mg']
    assert parse_macro('100cal') == [100, 'cal']
    assert parse_macro('100kcal') == [100, 'cal']
    assert parse_macro('100 g of protein') == [100, 'g']
    assert parse_macro('100 mg of sodium') == [100, 'mg']
