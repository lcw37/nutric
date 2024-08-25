'use client'


import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

import { EntryModel } from '@/lib/types';


export function EntryCard({
    entry,
    handleDeleteEntry,
    handleUpdateEntry
}: {
    entry: EntryModel,
    handleDeleteEntry: (deletedEntry: EntryModel) => void,
    handleUpdateEntry: (modifiedEntry: EntryModel) => void
}) {
    const { 
        id, 
        author_id, 
        servings: initServings, 
        entry_date,
        estimate: {
            title, 
            nutrition_breakdown: nutritionBreakdown
        }
    } = entry
    if (!id) return (<></>) // TODO: I think if the EntryModel id field is not optional, this is not necessary

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    
    const [servings, setServings] = useState(initServings) // set as string so trailing decimal points can work
    function handleServingsChange(e: any) {
        let newServings = e.target.value
        if (newServings === '.') { newServings = '0.' } // edge case: input is '.'
        if (!Number.isNaN(newServings)) { setServings(newServings) }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title.toLowerCase()}</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
                {/* servings, editable */}
                <div className="flex items-center justify-between">
                    <span>servings</span>
                    {!isEditing ? (
                        <span className="font-medium">{servings}</span>
                    ) : (
                        <Input value={servings} onChange={handleServingsChange} className="text-right text-sm w-10 h-6 p-1"/>
                    )}
                </div>
                {/* nutrition breakdown */}
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
                    {/* Edit/Save button */}
                    <div className="w-1/2">
                        {!isEditing ? (
                            // <Link href={`/log/edit/${entry.id}`} className="flex-1> 
                                <Button 
                                    variant="secondary" 
                                    // className="w-full"
                                    className="w-full"
                                    onClick={() => setIsEditing(true)}
                                    disabled={isDeleteConfirmOpen}
                                >
                                    Edit
                                </Button>
                            // </Link> 
                        ) : (
                            <Button 
                                variant="secondary" 
                                // className="w-full"
                                className="w-full bg-emerald-100 hover:bg-emerald-200"
                                onClick={async () => {
                                    const modifiedEntry = await updateEntry(
                                        id, {
                                            servings: servings
                                        }
                                    )
                                    handleUpdateEntry(modifiedEntry)
                                    setIsEditing(false)
                                }}
                            >
                                Save
                            </Button>
                        )}
                    </div>
                    
                    {/* Delete/Confirm button */}
                    <div className="w-1/2">
                        {!isDeleteConfirmOpen ? (
                            <Button 
                                variant="secondary"
                                className="w-full"
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                disabled={isEditing}
                            >
                                Delete
                            </Button>
                        ) : (
                            <>
                                <Button 
                                    variant="secondary" 
                                    className="w-1/4 border-r-4 border-r-white"
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                >
                                    x
                                </Button>
                                <Button 
                                    variant="secondary"
                                    className="w-3/4 bg-red-200 hover:bg-red-300"
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
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
