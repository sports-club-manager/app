import { getPageList } from "$lib/server/db";

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return new Response(JSON.stringify({ pages: await getPageList() }));
}
