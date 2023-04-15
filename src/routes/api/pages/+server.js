import { getPageList } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
    return json({ pages: await getPageList() });
};
