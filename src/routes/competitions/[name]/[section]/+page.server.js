// @ts-nocheck
import { findResults, findTournament } from "$lib/server/db";

const tournament = await findTournament();

/** @type {import('./$types').RequestHandler} */
export const load = async ({ params }) => {
    if (!tournament.competitions.find((c) => c.name === params.name && c.section === params.section)) {
        return { status: 404 };
    }

    let results = await findResults(params.name, params.section);

    return {
        _results: JSON.parse(JSON.stringify(results)),
        name: params.name,
        section: params.section,
    };
};
