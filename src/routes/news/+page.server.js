import { getNews, saveNews } from "$lib/db";
import { io } from "$lib/socket-client";

export const GET = async () => {
    return {
        body: { _news: await getNews() },
    };
};

export const post = async ({ request }) => {
    const newsItem = await saveNews(await request.json());

    // broadcast the news on the socket
    io.emit("save-news", newsItem);

    return {
        headers: {
            status: 201,
        },
        body: newsItem,
    };
};
