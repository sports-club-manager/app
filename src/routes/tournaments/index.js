import { findTournament } from "$lib/db";

export const get = async () => {
    return {
        body: { tournament: await findTournament() },
    };
};
