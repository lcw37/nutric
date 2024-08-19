from pydantic import BaseModel, NonNegativeInt, field_validator, AnyUrl
from typing import Literal, Union


class MinMaxPair(BaseModel):
    min: NonNegativeInt
    max: NonNegativeInt | None = None
    unit: str
    
    @field_validator('max')
    @classmethod
    def validate_max(cls, v, values):
        if v is None: # set default value to min
            return cls.min
        if v < values.data['min']:
            raise ValueError('max must be greater than or equal to min')
        return v
    
class NutritionBreakdown(BaseModel):
    calories: MinMaxPair | None = None
    carbs: MinMaxPair | None = None
    fat: MinMaxPair | None = None
    protein: MinMaxPair | None = None

class EstimateFormData(BaseModel):
    description: str | None # not optional?
    nutrient_fields: list[str] | None = None
    followup: str | None = None
    followup_response: str | None = None
    
class RecipeFormData(BaseModel):
    recipe_url: AnyUrl
    
class EstimateResponse(BaseModel):
    response_type: Literal['followup', 'estimateFromDescription', 'estimateFromRecipe']
    data: Union[EstimateFormData, RecipeFormData]
    estimate: NutritionBreakdown | None = None