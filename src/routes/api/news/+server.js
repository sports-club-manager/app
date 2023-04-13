import { saveNews } from "$lib/server/db";
import { io } from "$lib/socket-client";

// @ts-nocheck
export const POST = async ({ request }) => {
    const newsItem = await saveNews(await request.json());

    // broadcast the news on the socket
    io.emit("save-news", newsItem);

    return {
        headers: {
            "status": 201,
        },
        body: newsItem,
    };
};
