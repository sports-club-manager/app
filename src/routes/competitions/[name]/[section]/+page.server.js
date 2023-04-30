// @ts-nocheck
import { findResultsByAgeGroupAndSection, findTournament } from "$lib/server/db";

const tournament = await findTournament();

/** @type {import('./$types').RequestHandler} */
export const load = async ({ params }) => {
    if (!tournament.competitions.find((c) => c.name === params.name && c.section === params.section)) {
        return { status: 404 };
    }

    let results = await findResultsByAgeGroupAndSection(params.name, params.section);

    return {
        results: JSON.parse(JSON.stringify(results)),
        name: params.name,
        section: params.section,
    };
};
