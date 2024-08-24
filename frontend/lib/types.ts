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

interface EntryModel {
    id?: string
    author_id: string
    data: any
    estimate: MealModel,
    servings: string,
    entry_date: string
}

interface Targets {
    calories: number,
    carbs: number,
    fat: number,
    protein: number

    [key: string]: number
}

interface TargetsModel {
    id?: string,
    author_id: string,
    targets: Targets,
    entry_date?: string
}


export type {
    NutritionBreakdown, 
    MealModel,
    DescriptionFormData,
    RecipeFormData,
    EstimateResponse,
    EntryModel,
    TargetsModel,
    Targets
}