interface MinMaxPair {
    min: number,
    max: number,
    unit: string
}

interface NutritionBreakdown {
    calories: MinMaxPair
    carbs: MinMaxPair
    fat: MinMaxPair;
    protein: MinMaxPair

    [key: string]: MinMaxPair;
}

interface MealModel {
    title: string
    nutrition_breakdown: NutritionBreakdown
}

interface DescriptionFormData {
    description: string
    nutrient_fields: string[] | null
    followup: string | null
    followup_response: string | null
}

interface RecipeFormData {
    recipe_url: string
}

type EstimateResponse = {
    response_type: 'followup' | 'estimateFromDescription' | 'estimateFromRecipe' | null
    data: DescriptionFormData | RecipeFormData | null
    estimate: MealModel | null
};

interface Entry {
    id?: string
    author_id: string
    data: any
    estimate: {
        title: string;
        nutrition_breakdown: NutritionBreakdown
    },
    servings: string,
    entry_date?: string
}


export type {
    NutritionBreakdown, 
    MealModel,
    DescriptionFormData,
    RecipeFormData,
    EstimateResponse,
    Entry
}