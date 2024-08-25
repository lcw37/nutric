'use client'


import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button"
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
    CardDescription
} from "@/components/ui/card"

import { deleteEntry, updateEntry } from '../actions';
import Link from 'next/link';

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
        <Card className="bg-emerald-50 border-none">
            <CardHeader>
                <CardTitle>totals</CardTitle>
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

export function EntryCard({
    entry,
    handleDeleteEntry
}: {
    entry: EntryModel,
    handleDeleteEntry: (deletedEntry: EntryModel) => void
}) {
    const { 
        id,
        author_id,
        estimate: {
            title, 
            nutrition_breakdown: nutritionBreakdown
        }, 
        servings,
        entry_date
    } = entry
    if (!id) return (<></>) // TODO: I think if the EntryModel id field is not optional, this is not necessary

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    
    // const [servings, setServings] = useState(entry.servings) // set as string so trailing decimal points can work
    // function handleServingsChange(e: any) {
    //     let newServings = e.target.value
    //     if (newServings === '.') { newServings = '0.' } // edge case: input is '.'
    //     if (!Number.isNaN(newServings)) { setServings(newServings) }
    // }
    // useEffect(() => {
    //     setServings(entry.servings)
    // }, [entry])
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* <Label>servings</Label> */}
                {/* <Input value={servings} onChange={handleServingsChange} /> */}
                <div className="flex items-center justify-between">
                    <span>servings</span>
                    <span className="font-medium">{servings}</span>
                </div>
                {Object.keys(nutritionBreakdown).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        {('description' in entry.data) && (
                            <span className="font-medium">
                                {+(Number(servings) * nutritionBreakdown[k].min).toFixed(1)} - {+(Number(servings) * nutritionBreakdown[k].max).toFixed(1)} {nutritionBreakdown[k].unit}
                            </span>
                        )}
                        {('recipe_url' in entry.data) && (
                            <span className="font-medium">
                                {+(Number(servings) * nutritionBreakdown[k].min).toFixed(1)} {nutritionBreakdown[k].unit}
                            </span>
                        )}
                    </div>
                ))}
                <div className="flex gap-4">
                    <Link href={`/log/edit/${entry.id}`} className="flex-1">
                        <Button variant="secondary" className="w-full">
                            Edit
                        </Button>
                    </Link>
                    {!isDeleteConfirmOpen ? (
                        <Button 
                            variant="secondary" 
                            className="flex-1 p-0"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                        >
                            Delete
                        </Button>
                    ) : (
                        <div className="flex-1 p-0">
                            <Button 
                                variant="secondary" 
                                className="w-1/4 border-r-4 border-r-white"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                            >
                                x
                            </Button>
                            <Button 
                                variant="secondary" 
                                className="w-3/4"
                                onClick={async () => {
                                    await deleteEntry(
                                        id, {
                                            author_id: author_id,
                                            entry_date: entry_date
                                        }
                                    )
                                    handleDeleteEntry(entry)
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
