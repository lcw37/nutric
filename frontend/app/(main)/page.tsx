import InputForm from "./ui/Calculator/InputForm";


export default async function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start py-0 px-10">
            <InputForm />
        </main>
    );
}
