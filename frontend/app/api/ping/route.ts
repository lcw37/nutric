import { pingBackend } from "../../(main)/actions";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest) {
    console.log('REQ', req)
    const pong = await pingBackend()
    return new Response(pong.message)
}