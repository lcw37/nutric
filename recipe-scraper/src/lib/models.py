from typing import List, Dict
from pydantic import BaseModel, PositiveInt


# class Macros(BaseModel):
#     carbs: List[PositiveInt]
#     fat: List[PositiveInt]
#     protein: List[PositiveInt]

class NutritionEstimate(BaseModel):
    calories: List[PositiveInt]
    macros: Dict[str, List[PositiveInt]]
