import { pingBackend } from "./actions";
import InputForm from "./ui/InputForm/InputForm";


export default async function Home() {
  const pong = await pingBackend()
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-24 px-10">
      <InputForm />
    </main>
  );
}
