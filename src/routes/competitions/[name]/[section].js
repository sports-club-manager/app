import { findResultsByAgeGroup, findTournament } from "$lib/db";

const tournament = await findTournament();

/** @type {import('./__types/[id]').RequestHandler} */
export const get = async ({ params }) => {

    if (!tournament.competitions.find((c) => c.name === params.name && c.section === params.section)) {
        return { status: 404 };
    }

    // TODO: figure out why this doesn't work
    //let results = await findResults(params.name, params.section);
    let results = await findResultsByAgeGroup(params.name);

    return {
        body: {
            tournament: tournament,
            _results: results,
            name: params.name,
            section: params.section,
        },
    };
};
