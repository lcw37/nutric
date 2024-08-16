'use client'


import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { submitMealDescription, submitRecipeURL } from "../actions"
import { useFormState, useFormStatus } from "react-dom"
import EstimateCard from "./EstimateCard"
import EstimateFromRecipeCard from "./EstimateFromRecipeCard"
import { Label } from "@/components/ui/label"
import isUrl from 'is-url-superb'
import { Input } from "@/components/ui/input"


function SubmitButton() {
    const status = useFormStatus()
    return (
        <Button 
            type="submit" 
            className="w-full" 
            disabled={status.pending}
        >
            submit
        </Button>
    )
}

export default function EstimateInputForm() {
    const [state, formAction] = useFormState(handleFormSubmit, {
        response_type: null,
        data: {
            description: null,
            followup: null,
            followup_response: null
        },
        estimate: null
    })

    const [servings, setServings] = useState(1.0)
    function handleServingsChange(e: any) {setServings(e.target.value)}

    async function handleFormSubmit(prevState: any, payload: any) {
        // if a URL was submitted:
        if (isUrl(payload.get('description'))) {
            const res = await submitRecipeURL(payload)
            const output = {
                estimateFromRecipe: res.nutrients
            }
            return output
        }

        // if there was a followup, attach to FormData (because it isn't auto-included on submit)
        if (prevState.data.followup) {
            payload.append('followup', prevState.data.followup)
        }
        const res = await submitMealDescription(payload)
        return res
    }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 py-0">
      <div className="text-center">
        <h1 className="text-3xl font-bold">nutrition calc</h1>
        <p className="text-muted-foreground">describe your meal or enter a recipe url to get a nutrient breakdown.</p>
      </div>

      {/* Enter meal description */}
      <Card>
        <CardHeader className="pt-0"> {/* top padding 0 while no Card title */}
          {/* <CardTitle>Describe Your Meal</CardTitle> */}
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" action={formAction}>
            <Label htmlFor="description">description / url</Label>
            <Textarea
              name="description"
              placeholder="describe your meal or enter a recipe url..."
              className="min-h-[80px]"
              readOnly={state.data?.followup || state.estimate}
              required
            />
            {/* If followup is received */}
            {state.data?.followup && (
              <div className="grid gap-3 mt-3">
                <Label htmlFor="followup_response" className="m-100">
                  {state.data?.followup.toLowerCase()}
                </Label>
                <Textarea
                  name="followup_response"
                  placeholder="Enter your response"
                  className="min-h-[80px]"
                //   readOnly={state.estimate}
                  required
                />
              </div>
            )}
            <SubmitButton />
            
          </form>
        </CardContent>
      </Card>


      {/* View nutrition breakdown */}
      {state.estimate && (
        <Card>
            <CardHeader>
            <CardTitle>Estimated Nutrition Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <EstimateCard estimate={state.estimate} />
            </CardContent>
        </Card>)}

      {state.estimateFromRecipe && (
        <Card>
            <CardHeader>
            <CardTitle>Estimated Nutrition Breakdown</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4">
                <Label>servings</Label>
                <Input value={servings} onChange={handleServingsChange} />
                <EstimateFromRecipeCard estimateFromRecipe={state.estimateFromRecipe} servings={servings}/>
            </CardContent>
        </Card>
      )}
    </div>
  )
}