import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddToLogButton } from "./Buttons"
import { EstimateResponse } from "@/lib/types"


export default function NutritionBreakdownCard({ 
    estimateResponse
}: { 
    estimateResponse: EstimateResponse
}) {
    const { response_type, data, estimate } = estimateResponse
    if (!response_type || !data || !estimate) { return (<></>) }
    const { title, nutrition_breakdown } = estimate

    const [servings, setServings] = useState('1.0') // set as string so trailing decimal points can work
    function handleServingsChange(e: any) {
        let newServings = e.target.value
        if (newServings === '.') { newServings = '0.' } // edge case: input is '.'
        if (!Number.isNaN(newServings)) { setServings(newServings) }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Label>servings</Label>
                <Input value={servings} onChange={handleServingsChange} />
                {Object.keys(nutrition_breakdown).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        {(response_type === 'estimateFromDescription') && (
                            <span className="font-medium">
                                {+(Number(servings) * nutrition_breakdown[k].min).toFixed(1)}-{+(Number(servings) * nutrition_breakdown[k].max).toFixed(1)} {nutrition_breakdown[k].unit}
                            </span>
                        )}
                        {(response_type === 'estimateFromRecipe') && (
                            <span className="font-medium">
                                {+(Number(servings) * nutrition_breakdown[k].min).toFixed(1)} {nutrition_breakdown[k].unit}
                            </span>
                        )}
                    </div>
                ))}
                <AddToLogButton 
                    estimateResponse={estimateResponse}
                    servings={servings}
                />
            </CardContent>
        </Card>
    )
}