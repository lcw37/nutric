from pydantic import BaseModel, PositiveInt, field_validator


class MinMaxPair(BaseModel):
    min: PositiveInt
    max: PositiveInt = lambda self: self.min # default to min
    unit: str
    
    @field_validator('max')
    @classmethod
    def validate_max(cls, v, values):
        if v < values.data['min']:
            raise ValueError('max must be greater than or equal to min')
        return v
    
    
class NutritionValues(BaseModel):
    calories: MinMaxPair | None = None
    carbs: MinMaxPair | None = None
    fat: MinMaxPair | None = None
    protein: MinMaxPair | None = None

class EstimateFormData(BaseModel):
    description: str | None = None
    nutrient_fields: list[str] | None = None
    followup: str | None = None
    followup_response: str | None = None