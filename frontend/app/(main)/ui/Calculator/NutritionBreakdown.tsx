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
    const [servings, setServings] = useState('1.0') // set as string so trailing decimal points can work
    function handleServingsChange(e: any) {
        let newServings = e.target.value
        if (newServings === '.') { newServings = '0.' } // edge case: input is '.'
        if (!Number.isNaN(newServings)) { setServings(newServings) }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>nutrition breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Label>servings</Label>
                <Input value={servings} onChange={handleServingsChange} />
                {Object.keys(estimate).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        {(estimateType === 'fromDescription') && (
                            <span className="font-medium">
                                {+(Number(servings) * estimate[k].min).toFixed(1)}-{+(Number(servings) * estimate[k].max).toFixed(1)} {estimate[k].unit}
                            </span>
                        )}
                        {(estimateType === 'fromRecipe') && (
                            <span className="font-medium">
                                {+(Number(servings) * estimate[k].min).toFixed(1)} {estimate[k].unit}
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