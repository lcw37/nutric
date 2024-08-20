// import { useUser } from "@stackframe/stack"
import { stackServerApp } from "@/stack"
import { readAllEntries } from "../actions"

export default async function Log() {
    const user = await stackServerApp.getUser()
    let entries = 'not logged in'
    if (user) {entries = await readAllEntries(user.id)}
    return (
        <main>
            {JSON.stringify(entries)}
        </main>
    )
}