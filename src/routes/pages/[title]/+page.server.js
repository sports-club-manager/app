// @ts-nocheck
import { findPage } from "$lib/server/db";

export const load = async ({ params }) => {
    let infoPage = await findPage(params.title);

    if (infoPage) {
        return {
            infoPage: JSON.parse(JSON.stringify(infoPage)),
        };
    }

    return {
        status: 404,
    };
};
