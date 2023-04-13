// @ts-nocheck
import { findResultsByAgeGroup } from "$lib/server/db";

export const GET = async () => {
    return new Response(await findResultsByAgeGroup("U11"));
};
