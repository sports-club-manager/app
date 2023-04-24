// @ts-nocheck
import { findResults } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export const load = async ({ fetch }) => {
    let results = await fetch("/api/results");
    return { results: await results.json() };
};
