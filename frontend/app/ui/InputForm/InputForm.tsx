'use client'


import React, { useRef } from "react"
import { useFormState, useFormStatus } from "react-dom"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import NutritionBreakdownCard from "./NutritionBreakdown"

import { submitMealDescription, submitRecipeURL } from "../../actions"
import isUrl from 'is-url-superb'


function SubmitButton() {
    const formStatus = useFormStatus()
        return (
            <Button 
                type="submit" 
                className="w-full" 
                disabled={formStatus.pending}
            >
                submit
            </Button>
    )
}


export default function InputForm() {
    const [state, formAction] = useFormState(handleFormSubmit, {
        response_type: null,
        data: {
            description: null,
            followup: null,
            followup_response: null
        },
        estimate: null
    })
    const followupTextAreaRef = useRef<HTMLTextAreaElement>(null)

    async function handleFormSubmit(prevState: any, payload: any) {
        // ~~~ if input is a URL:
        if (isUrl(payload.get('description'))) {
            const res = await submitRecipeURL(payload)
            console.log(res)
            return res
            // const output = {
            //     estimateFromRecipe: res.estimate
            // }
            // return output
            
        }
        // ~~~ else if input is a text description:
        // if the initial description was changed, remove existing followup, then regenerate followup/estimate
        if (prevState.data.description !== payload.get('description')) {
            prevState.data.followup = null
            // prevState.data.followup_response = null
            payload.delete('followup_response')
            if (followupTextAreaRef.current) { followupTextAreaRef.current.value = '' }
        }
        // if there was a followup, attach to FormData (because it isn't auto-included on submit)
        if (prevState.data?.followup) { payload.append('followup', prevState.data.followup) }
        const res = await submitMealDescription(payload)
        return res
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8 py-0">
            <div className="text-left">
                <h1 className="text-3xl font-bold">nutrition calc</h1>
                <p className="text-muted-foreground">
                    input a <span className="text-green-700 font-semibold">meal description</span> or a <span className="text-green-700 font-semibold">recipe url</span> to get a nutrient breakdown.
                </p>
            </div>

            {/* Enter meal description */}
            <Card>
                <CardHeader className="pt-0"> {/* top padding 0 while no Card title */}</CardHeader>
                <CardContent>
                <form className="grid gap-3" action={formAction}>
                    <Label htmlFor="description">description / url</Label>
                    <Textarea
                        name="description"
                        className="min-h-[80px]"
                        required
                    />
                    {/* If followup is received */}
                    {state.data?.followup && (
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
            {state.estimate && (
                <NutritionBreakdownCard estimate={state.estimate} type="fromDescription" />
            )}

            {state.estimateFromRecipe && (
                <NutritionBreakdownCard estimate={state.estimateFromRecipe} type="fromRecipe"/>
            )}
        </div>
    )
}