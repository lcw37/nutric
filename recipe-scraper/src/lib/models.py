from pydantic import BaseModel, NonNegativeInt, field_validator, AnyUrl, PositiveFloat
from typing import Literal, Union
from datetime import date


#  ~~~ API models
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
    
    @classmethod
    def multiply_by_servings(cls, nb: 'NutritionBreakdown', servings: float) -> 'NutritionBreakdown':
        data = nb.model_dump()
        for k, v in data.items():
            if isinstance(v, MinMaxPair):
                data[k].min *= servings
                data[k].max *= servings
        return cls(**data)

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

    
# ~~~ MongoDB models

class Log(BaseModel):
    data: Union[EstimateFormData, RecipeFormData] # original data that the estimate was generated from
    estimate: NutritionBreakdown
    servings: PositiveFloat
    entry_date: date = date.today()