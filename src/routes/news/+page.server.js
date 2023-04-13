import { getNews } from "$lib/server/db";

export const load = async () => {
    return {
        _news: JSON.parse(JSON.stringify(await getNews())),
    };
};
