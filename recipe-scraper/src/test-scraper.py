from lib.recipes import get_nutrition_from_url


url = 'https://cafedelites.com/authentic-chimichurri-uruguay-argentina/'
servings = 1.0
result = get_nutrition_from_url(url=url, servings=servings)
print(result)