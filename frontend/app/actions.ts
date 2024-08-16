'use server'


export async function pingBackend() {
    const res = await fetch('http://localhost:8000/ping')
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
    const res = await fetch('http://127.0.0.1:8000/estimate', {
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
    const res = await fetch('http://127.0.0.1:8000/recipe', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}