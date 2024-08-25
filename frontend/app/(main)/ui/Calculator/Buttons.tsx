'use client'


import { useEffect, useState } from "react";
import clsx from "clsx";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { createEntry } from "../../actions";
import { EstimateResponse } from "@/lib/types";


export function AddToLogButton({
    estimateResponse,
    servings
}: {
    estimateResponse: EstimateResponse,
    servings: string
}) {
    const { data, estimate } = estimateResponse
    if (!data || !estimate) { return <></> }

    const [isAdded, setIsAdded] = useState(false)

    useEffect(() => {
        setIsAdded(false)
    }, [estimateResponse])

    const user = useUser()
    if (user) {
        return (
            <Button
                variant="secondary"
                onClick={async () => {
                    await createEntry({
                        author_id: user.id,
                        data: data,
                        estimate: estimate,
                        servings: servings
                    })
                    setIsAdded(true)
                }}
                disabled={isAdded}
                className={clsx({
                    'bg-emerald-100 hover:bg-emerald-200': isAdded
                })}
            >
                    {isAdded ? 'done!' : 'add to my log'}
            </Button>
        )
    }
    return (
        <Button>
            <Link href="/handler/sign-up">log in to save logs</Link>
        </Button>
    )
}

export function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            variant="secondary"
            type="submit" 
            className="w-full" 
            disabled={pending}
        >
            submit
        </Button>
    )
}