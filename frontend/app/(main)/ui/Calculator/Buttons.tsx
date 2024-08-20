'use client'

import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { createEntry } from "../../actions";


export function AddToLogButton({
    data,
    estimate,
    servings
}: {
    data: any,
    estimate: any,
    servings: number
}) {
    const user = useUser()
    if (user) {
        return (
            <Button
                onClick={() => {
                    createEntry({
                        author_id: user.id,
                        data: data,
                        estimate: estimate,
                        servings: servings
                    })
                }}
            >
                    add to my log
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
    const formStatus = useFormStatus()
        return (
            <Button 
                type="submit" 
                className="w-full" 
                disabled={formStatus.pending}
            >
                submit
            </Button>
    )
}