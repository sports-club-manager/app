// @ts-ignore
import { findResultsByAgeGroup } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
    return json(await findResultsByAgeGroup("U11"));
};
