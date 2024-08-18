'use client'

import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import { useFormStatus } from "react-dom";


export function AddToLogButton() {
    const currentUser = useUser()
    if (currentUser) {
        return (
            <Button>
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