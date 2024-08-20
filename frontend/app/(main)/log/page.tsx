import { readAllEntries } from "../actions"

export default async function Log() {
    const entries = await readAllEntries()
    return (
        <main>
            {JSON.stringify(entries)}
        </main>
    )
}