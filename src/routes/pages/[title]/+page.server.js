// @ts-nocheck
import { error } from "@sveltejs/kit";

import { findPage } from "$lib/server/db";

export const load = async ({ params }) => {
    let infoPage = await findPage(params.title);

    if (!infoPage) {
        throw error(404, {
            message: "Not found",
        });
    }

    return {
        infoPage: JSON.parse(JSON.stringify(infoPage)),
    };
};
