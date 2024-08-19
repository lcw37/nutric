import { pingBackend } from "../../(main)/actions";


export async function GET(req: Request) {
    const pong = await pingBackend()
    return new Response(pong.message)
}