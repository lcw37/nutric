'use client'


import React, { useRef } from "react"
import { useFormState } from "react-dom"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import NutritionBreakdownCard from "./NutritionBreakdown"
import { SubmitButton } from "./Buttons"

import { submitMealDescription, submitRecipeURL } from "../../actions"
import isUrl from 'is-url-superb'

import { DescriptionFormData, EstimateResponse, RecipeFormData } from "@/lib/types"


export default function InputForm() {
    const initialState: EstimateResponse = {
        response_type: null,
        data: null,
        estimate: null
    }
    const [state, formAction] = useFormState(handleFormSubmit, initialState)

    // functions to manage uncontrolled inputs
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null)
    const followupTextAreaRef = useRef<HTMLTextAreaElement>(null)
    function setDescription(text: string) {
        if (descriptionTextAreaRef.current) { 
            descriptionTextAreaRef.current.value = text 
        }
    }
    function setFollowup(text: string) {
        if (followupTextAreaRef.current) { 
            followupTextAreaRef.current.value = text 
        }
    }

    // choose random description or recipe URL
    function getRandomExample(choices: string[]) {
        return choices[Math.floor(Math.random() * choices.length)];
    }
    const descriptionChoices = [
        'baked eggplant parm, baked carrots, and a slice of whole wheat bread',
        'tofu salad with ginger dressing and croutons, a side of fries',
        'grilled salmon with lemon, rice, and sauteed spinach'
    ]
    const recipeChoices = [
        'https://cafedelites.com/authentic-chimichurri-uruguay-argentina/',
        'https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/',
        'https://www.allrecipes.com/recipe/15184/mouth-watering-stuffed-mushrooms/'
    ]
        
    async function handleFormSubmit(prevState: EstimateResponse, payload: FormData): Promise<EstimateResponse> {
        let res: EstimateResponse = {
            response_type: null,
            data: null,
            estimate: null
        }
        const input = payload.get('description') as string
        // ~~~ if input is a URL:
        if (isUrl(input)) {
            const recipePayload: RecipeFormData = { recipe_url: input.trim() }
            res = await submitRecipeURL(recipePayload)
        } 
        // ~~~ else if input is a description:
        else {
            const descriptionPayload: DescriptionFormData = {
                description: input,
                nutrient_fields: Array.from(payload.getAll('nutrientFields')) as string[] || null,
                followup: payload.get('followup') as string || null,
                followup_response: payload.get('followup_response') as string || null,
            }
            // if there was a previous state and that state was a DescriptionFormData:
            if (prevState.data && 'description' in prevState.data) {
                // if the description was changed, reset description and re-generate a response
                if (prevState.data.description !== descriptionPayload.description) {
                    descriptionPayload.followup = null
                    descriptionPayload.followup_response = null
                    setFollowup('')
                } else {
                    // if there was a followup, set the payload's followup (because prevState data isn't auto-included on submit)
                    descriptionPayload.followup = prevState.data.followup
                }
            }
            res = await submitMealDescription(descriptionPayload)
        }
        return res
    }
    return (
        <div className="w-full max-w-md mx-auto space-y-8 py-0">
            <div className="text-left grid gap-4">
                {/* <h1 className="text-3xl font-bold">nutrition calculator</h1> */}
                <p className="text-muted-foreground">
                    input a <span className="text-emerald-600 font-semibold">meal description</span> or a <span className="text-emerald-600 font-semibold">recipe url</span> to get a nutrition breakdown.
                </p>
                <div className="text-muted-foreground">
                    <div className="flex gap-4 items-center">
                        <span>want a quick demo?</span>
                        <Button
                            variant="outline"
                            onClick={() => setDescription(getRandomExample(descriptionChoices))}
                        >
                            description
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setDescription(getRandomExample(recipeChoices))}
                        >
                            recipe
                        </Button>
                    </div>
                </div>
            </div>

            {/* Enter meal description */}
            <Card>
                <CardHeader className="pt-0"> {/* top padding 0 while no Card title */}</CardHeader>
                <CardContent>
                <form className="grid gap-3" action={formAction}>
                    <Label htmlFor="description">description / url</Label>
                    <Textarea
                        name="description"
                        ref={descriptionTextAreaRef}
                        className="min-h-[80px]"
                        required
                    />
                    {/* If followup is received */}
                    {state.data 
                    && 'description' in state.data 
                    && state.data?.followup && (
                        <div className="grid gap-3 mt-3">
                            <Label htmlFor="followup_response" className="m-100">
                                {state.data.followup.toLowerCase()}
                            </Label>
                            <Textarea
                                name="followup_response"
                                ref={followupTextAreaRef}
                                className="min-h-[80px]"
                                required={false}
                            />
                        </div>
                    )}
                    <SubmitButton />
                </form>
                </CardContent>
            </Card>

            {/* View nutrition breakdown */}
            <NutritionBreakdownCard estimateResponse={state} />
        </div>
    )
}