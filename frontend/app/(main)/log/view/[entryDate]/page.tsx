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
import { TotalCard, SkeletonTotalCard } from '../../TotalCard';
import { EntryCard } from '../../EntryCard';

import { cn } from "@/lib/utils"
import { format, parse } from "date-fns"
import { readAllEntries, readTargets } from '@/app/(main)/actions';

import { EntryModel, Targets } from '@/lib/types';
import { useRouter } from 'next/navigation';


export default function Log({ params }: { params: { entryDate: string } }) {
    const router = useRouter()
    const user = useUser({ or: 'redirect' })

    const [loading, setLoading] = useState(false)

    const { entryDate } = params
    const date = parse(entryDate, 'MM-dd-yyyy', new Date())

    const initEntries: EntryModel[] = []
    const [entries, setEntries] = useState(initEntries)
    
    const initTargets: Targets = {calories: 100, carbs: 50, fat: 25, protein: 75}
    const [targets, setTargets] = useState(initTargets)

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            // get entries + targets for current user and current page's entry date
            const fetchedEntries: EntryModel[] = (await readAllEntries(user.id, {entry_date: entryDate})).entries
            let fetchedTargets: Targets = initTargets
            try {
                // tries to fetch the most recently created targets
                fetchedTargets = (await readTargets(user.id, {entry_date: entryDate})).targets
            } catch (error) {
                // if the current page's entry date is before any existing targets, fetch the most recent (TODO: check that this throws an error if targets doesn't exist)
                fetchedTargets = (await readTargets(user.id, {})).targets
            }
            setEntries(fetchedEntries)
            setTargets(fetchedTargets)
            setLoading(false)
        };
        fetchData();
    }, [])

    async function handleDeleteEntry(deletedEntry: EntryModel) {
        const updatedEntries = entries.filter((entry) => entry !== deletedEntry)
        setEntries(updatedEntries)
    }

    async function handleUpdateEntry(modifiedEntry: EntryModel) {
        const updatedEntries = [...entries]
        const index = updatedEntries.findIndex(entry => entry.id === modifiedEntry.id)
        updatedEntries[index] = modifiedEntry
        setEntries(updatedEntries)
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8 py-0">
            {/* date selector */}
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
                <SkeletonTotalCard />
            ) : (
                <>
                    {/* show targets if found */}
                    {targets ? (
                        <TotalCard 
                            entries={entries} 
                            targets={targets}
                        />
                    ) : (
                        // TODO: this shows because the trycatch readTargets() never reaches the catch
                        <p>No targets found</p>
                    )}

                    {/* show entries if found */}
                    {entries.length > 0 ? (
                        <>
                            {entries.map((entry: EntryModel, index: number) => (
                                <EntryCard 
                                    key={entry.id} 
                                    entry={entry}
                                    handleDeleteEntry={handleDeleteEntry}
                                    handleUpdateEntry={handleUpdateEntry}
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
