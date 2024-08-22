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
import { Skeleton } from "@/components/ui/skeleton"
import { EntryCard, TotalCard } from './Cards';

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { readAllEntries } from '../actions';

import { Entry } from '@/lib/types';


export default function Log() {
    const user = useUser({ or: 'redirect' })

    const [loading, setLoading] = useState(false)

    const [date, setDate] = useState<Date>(new Date()); // Initial date

    const initEntries: Entry[] = []
    const [entries, setEntries] = useState(initEntries);

    useEffect(() => {
        setLoading(true)
        const formattedEntryDate = format(date, 'MM-dd-yyyy')
        const fetchData = async () => {
            const fetchedEntries: Entry[] = (await readAllEntries(user.id, {entry_date: formattedEntryDate})).entries
            setEntries(fetchedEntries);
            setLoading(false);
        };
        fetchData();
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
                        onSelect={(value) => {
                            if (value) { setDate(value) } 
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {loading ? (
                <>
                    <Skeleton className="h-[240px] rounded-xl" />
                    <Skeleton className="h-[300px] rounded-xl" />
                </>
            ) : entries.length > 0 ? (
                <>
                    <TotalCard entries={entries}/>
                    {entries.map((entry: Entry, index: number) => (
                        <EntryCard key={index.toString() + date} entry={entry} />
                    ))}
                </>
            ) : (
                <p>No entries found</p>
            )}
        </div>
    )
}
