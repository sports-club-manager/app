import { findTournament } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
    return json({ tournament: await findTournament() });
};
