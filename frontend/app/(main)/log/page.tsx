'use client'


import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';

import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { deleteEntry, readAllEntries, updateEntry } from '../actions';
import Link from 'next/link';




interface Entry {
    id: string
    author_id: string
    data: any
    estimate: any,
    servings: string,
    entry_date: string
}

export default function Log() {
    const user = useUser({ or: 'redirect' })
    const [date, setDate] = useState<Date>(new Date()); // Initial date
    const initState: Entry[] = []
    const [entries, setEntries] = useState(initState);


    useEffect(() => {
        if (date) {
            const formattedEntryDate = format(date, 'MM-dd-yyyy')
            const fetchData = async () => {
                const fetchedEntries: Entry[] = (await readAllEntries(user.id, {entry_date: formattedEntryDate})).entries
                setEntries(fetchedEntries);
            };
            fetchData();
        }
    }, [date]); // Re-fetch when date changes
    return (
        <div className="w-full max-w-md mx-auto space-y-8 py-0">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(value) => {if (value) {setDate(value)}}}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
                {entries.map((entry: Entry, index: number) => (
                    <EntryCard key={index.toString() + date} entry={entry} />
                ))
            }
        </div>
    )
}

function EntryCard({
    entry
}: {
    entry: any,
}) {
    const { estimate, servings } = entry
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
                <CardTitle>nutrition breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* <Label>servings</Label> */}
                {/* <Input value={servings} onChange={handleServingsChange} /> */}
                <div className="flex items-center justify-between">
                    <span>servings</span>
                    <span className="font-medium">{servings}</span>
                </div>
                {Object.keys(estimate).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        {('description' in entry.data) && (
                            <span className="font-medium">
                                {+(Number(servings) * estimate[k].min).toFixed(1)}-{+(Number(servings) * estimate[k].max).toFixed(1)} {estimate[k].unit}
                            </span>
                        )}
                        {('recipe_url' in entry.data) && (
                            <span className="font-medium">
                                {+(Number(servings) * estimate[k].min).toFixed(1)} {estimate[k].unit}
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
                    <Button 
                        variant="secondary" 
                        className="flex-1 p-0"
                        onClick={async () => {
                            await deleteEntry(
                                entry.id, {
                                author_id: entry.author_id,
                            })
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function UpdateEntryButton({
    entry,
    newServings
}: {
    entry: any,
    newServings: string
}) {
    return (
        <Button
            onClick={async () => {
                await updateEntry(
                    entry.id, {
                    author_id: entry.author_id,
                    data: entry.data,
                    estimate: entry.estimate,
                    servings: newServings
                })
            }}
        >
                add to my log
        </Button>
)
}