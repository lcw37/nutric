'use client'


import { useState, useEffect } from 'react';

import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
    CardDescription
} from "@/components/ui/card"


import { EntryModel, NutritionBreakdown, Targets } from '@/lib/types';
import { ProgressBar, SkeletonProgressBar } from './ProgressBar';
import { Skeleton } from '@/components/ui/skeleton';


export function TotalCard({
    entries,
    targets,
}: {
    entries: EntryModel[],
    targets: Targets, // TODO: type this, maybe as NutritionBreakdown
}) {
    const [totals, setTotals] = useState<NutritionBreakdown>({
        calories: { min: 0, max: 0, unit: 'cal' },
        carbs: { min: 0, max: 0, unit: 'g' },
        fat: { min: 0, max: 0, unit: 'g' },
        protein: { min: 0, max: 0, unit: 'g' }
    })
    useEffect(() => {
        // sum up all nutrition
        function sumEntries(entries: EntryModel[]) {
            const totals: NutritionBreakdown = {
                calories: { min: 0, max: 0, unit: 'cal' },
                carbs: { min: 0, max: 0, unit: 'g' },
                fat: { min: 0, max: 0, unit: 'g' },
                protein: { min: 0, max: 0, unit: 'g' }
            }
            entries.forEach((entry) => {
                const { 
                    servings, 
                    estimate: {
                        nutrition_breakdown: {
                            calories, carbs, fat, protein
                        }
                    }
                } = entry
                totals.calories.min += calories.min * Number(servings)
                totals.calories.max += calories.max * Number(servings)
                totals.carbs.min += carbs.min * Number(servings)
                totals.carbs.max += carbs.max * Number(servings)
                totals.fat.min += fat.min * Number(servings)
                totals.fat.max += fat.max * Number(servings)
                totals.protein.min += protein.min * Number(servings)
                totals.protein.max += protein.max * Number(servings)
            })
            setTotals(totals)
        }
        sumEntries(entries)
    }, [entries])
    return (
        <Card className="bg-slate-200 border-none">
            <CardHeader>
                <CardTitle>totals</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {Object.keys(totals).length > 0 && (Object.keys(totals).map((k) => (
                    <ProgressBar key={k}
                        title={k}
                        minMaxPair={totals[k]}
                        target={targets[k]}
                    />
                )))}
            </CardContent>
        </Card>
    )
}

export function SkeletonTotalCard() {
    return (
        <>
            <Card className='border-none'>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-4 w-12" />
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {['calories', 'cards', 'fat', 'protein'].map((k) => {
                        return <SkeletonProgressBar key={k}/>
                    })}
                </CardContent>
            </Card>
        </>
    )
}
