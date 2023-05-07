import { findResultsByDay } from "$lib/server/db";

/** @type {import('../$types').RequestHandler} */
export const load = async ({ params }) => {
    let results = await findResultsByDay(params.day);
    return {
        results: JSON.parse(JSON.stringify(results)),
        day: params.day,
    };
};
