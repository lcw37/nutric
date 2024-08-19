import { pingBackend } from "../../(main)/actions";


export async function GET(req: Request) {
    console.log('REQ', req)
    const pong = await pingBackend()
    return new Response(pong.message)
}