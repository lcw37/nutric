import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";


export function AddToLogButton() {
    return (
        <Button>
            add to my log
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