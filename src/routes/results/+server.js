import { findResultsByAgeGroup } from "$lib/db";

export const GET = async () => {
    return {
        body: await findResultsByAgeGroup("U11"),
    };
};
