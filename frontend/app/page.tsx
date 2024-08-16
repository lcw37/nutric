import Image from "next/image";
import { pingBackend, submitMealDescription } from "./actions";
import EstimateInputForm from "./ui/EstimateInputForm";


export default async function Home() {
    const pong = await pingBackend()
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-24">
            {/* <form action={pingBackend}><button type="submit">Click Me</button></form> */}
            {/* <form action={submitMealDescription}><button type="submit">Click Me</button></form> */}
            <EstimateInputForm />
        </main>
    );
}
