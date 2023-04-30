// @ts-nocheck
import { findResults } from "$lib/server/db";

/** @type {import('./$types').RequestHandler} */
export const load = async ({ params }) => {
    let results = await findResults();
    return {
        results: JSON.parse(JSON.stringify(results)),
        selectedName: params.name,
    };
};
