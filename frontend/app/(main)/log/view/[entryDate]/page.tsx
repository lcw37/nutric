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
import { EntryCard, TotalCard, SkeletonTotalCard } from '../../Cards';

import { cn } from "@/lib/utils"
import { format, parse } from "date-fns"
import { deleteEntry, readAllEntries, readTargets } from '@/app/(main)/actions';

import { EntryModel, TargetsModel, Targets } from '@/lib/types';
import { redirect, useRouter } from 'next/navigation';


export default function Log({ params }: { params: { entryDate: string } }) {
    const { entryDate } = params
    const router = useRouter()

    const user = useUser({ or: 'redirect' })
    const [loading, setLoading] = useState(false)

    const date = parse(entryDate, 'MM-dd-yyyy', new Date())

    const initEntries: EntryModel[] = []
    const [entries, setEntries] = useState(initEntries)
    
    const initTargets: Targets = {calories: 100, carbs: 50, fat: 25, protein: 75}
    const [targets, setTargets] = useState(initTargets)

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            const fetchedEntries: EntryModel[] = (await readAllEntries(user.id, {entry_date: entryDate})).entries
            let fetchedTargets: Targets = initTargets
            try {
                fetchedTargets = (await readTargets(user.id, {entry_date: entryDate})).targets
            } catch (error) {
                fetchedTargets = (await readTargets(user.id, {})).targets
            }
            setEntries(fetchedEntries)
            setTargets(fetchedTargets)
            setLoading(false)
        };
        fetchData();
    }, [])
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
                            if (value) {
                                try {
                                    const newDate = format(value, 'MM-dd-yyyy')
                                    router.push(`/log/view/${newDate}`)
                                } catch (err) {
                                    router.push('/')
                                }
                            } 
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {loading ? (
                <>
                    {/* <Skeleton className="h-[240px] rounded-xl" /> */}
                    <SkeletonTotalCard />
                </>
            ) : (
                <>
                    {targets ? (
                        <TotalCard 
                            entries={entries} 
                            targets={targets}
                        />
                    ) : (
                        <p>No targets found</p>
                    )}
                    {/* show entries if found */}
                    {entries.length > 0 ? (
                        <>
                            {entries.map((entry: EntryModel, index: number) => (
                                <EntryCard 
                                    key={index.toString() + date} 
                                    entry={entry}
                                />
                            ))}
                        </>
                    ) : (
                        <p>No entries found</p>
                    )}
                </>
            )}
        </div>
    )
}
