import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


// nutrition breakdown from description
export function NutritionBreakdownFromDescription({ 
    estimate 
}: { 
    estimate: any 
}) {
    return (

        <Card>
            <CardHeader>
                <CardTitle>nutrition breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {Object.keys(estimate).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        <span className="font-medium">
                            {estimate[k].min}-{estimate[k].max} {estimate[k].unit}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

// nutrition breakdown from recipe
export function NutritionBreakdownFromRecipe({ 
    estimateFromRecipe
}: { 
    estimateFromRecipe: any
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
                {Object.keys(estimateFromRecipe).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        <span className="font-medium">{+(Number(servings) * estimateFromRecipe[k].min).toFixed(1)} {estimateFromRecipe[k].unit}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}