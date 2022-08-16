import { findPage } from "$lib/db";

/** @type {import('./$types').RequestHandler} */
export const get = async ({ params }) => {
    let infoPage = await findPage(params.title);

    if (infoPage) {
        return {
            body: { infoPage: infoPage },
        };
    }

    return {
        status: 404,
    };
};
