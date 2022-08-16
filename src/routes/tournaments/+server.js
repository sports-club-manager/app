import { findTournament } from "$lib/db";

export const GET = async () => {
    return {
        body: { tournament: await findTournament() },
    };
};
