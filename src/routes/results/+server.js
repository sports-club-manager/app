import { findResultsByAgeGroup } from "$lib/db";

export const get = async () => {
    return {
        body: await findResultsByAgeGroup("U11"),
    };
};
