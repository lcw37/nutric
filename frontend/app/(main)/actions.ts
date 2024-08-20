'use server'


import { createHash } from "crypto"

const apiBaseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
console.log(`frontend connected to: ${apiBaseUrl}`)

export async function pingBackend() {
    const res = await fetch(`${apiBaseUrl}/ping`)
    const pong = await res.json()
    console.log(pong)
    return pong
}

// export async function submitMealDescription(formData: FormData) {
export async function submitMealDescription(payload: any) {
    // extract payload FormData to object
    const data = {
        description: payload.get('description'),
        followup: payload.get('followup'),
        followup_response: payload.get('followup_response')
    }
    const res = await fetch(`${apiBaseUrl}/calculator/from-description`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}


export async function submitRecipeURL(payload: any) {
    const data = {
        recipe_url: payload.get('description').trim()
    }
    const res = await fetch(`${apiBaseUrl}/calculator/from-recipe`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}


// ~~~ MongoDB "auth"

const secret = process.env.BACKEND_AUTH_SECRET

function hashUserId(userId: string): string {
    const data = Buffer.from(userId + secret)
    const hash = createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
}

// ~~~ MongoDB CRUD

export async function readAllEntries(userId: string) {
    const res = await fetch(`${apiBaseUrl}/entries`, {
        method: 'GET',
        headers: {
            'X-UserId': userId,
            'X-HashedUserId': hashUserId(userId)
        }
    })
    return await res.json()
}