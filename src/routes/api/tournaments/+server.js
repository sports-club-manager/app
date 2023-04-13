import { findTournament } from "$lib/server/db";

export const GET = async () => {
    return new Response(JSON.stringify({ tournament: await findTournament() }));
};
