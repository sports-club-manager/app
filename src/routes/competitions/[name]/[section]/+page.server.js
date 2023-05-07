import { error } from "@sveltejs/kit";

import { findResultsByAgeGroupAndSection, findTournament } from "$lib/server/db";

const tournament = await findTournament();

export const prerender = false;

/** @type {import('./$types').RequestHandler} */
export const load = async ({ params }) => {
    if (!tournament.competitions.find((c) => c.name === params.name && c.section === params.section)) {
        throw error(404, {
            message: "Not found",
        });
    }

    let results = await findResultsByAgeGroupAndSection(params.name, params.section);

    return {
        results: JSON.parse(JSON.stringify(results)),
        name: params.name,
        section: params.section,
    };
};
