import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddToLogButton } from "./Buttons"


export default function NutritionBreakdownCard({ 
    estimateType,
    data,
    estimate,
}: { 
    estimateType: 'fromDescription' | 'fromRecipe',
    data: any,
    estimate: any,
}) {
    const { title, nutrition_breakdown: nutritionBreakdown } = estimate

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
                {Object.keys(nutritionBreakdown).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        {(estimateType === 'fromDescription') && (
                            <span className="font-medium">
                                {+(Number(servings) * nutritionBreakdown[k].min).toFixed(1)}-{+(Number(servings) * nutritionBreakdown[k].max).toFixed(1)} {nutritionBreakdown[k].unit}
                            </span>
                        )}
                        {(estimateType === 'fromRecipe') && (
                            <span className="font-medium">
                                {+(Number(servings) * nutritionBreakdown[k].min).toFixed(1)} {nutritionBreakdown[k].unit}
                            </span>
                        )}
                    </div>
                ))}
                <AddToLogButton 
                    data={data}
                    estimate={estimate}
                    servings={Number(servings)}
                />
            </CardContent>
        </Card>
    )
}