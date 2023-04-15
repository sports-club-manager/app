import { saveNews } from "$lib/server/db";
import { io } from "$lib/socket-client";
import { json } from "@sveltejs/kit";

// @ts-nocheck
export const POST = async ({ request }) => {
    const newsItem = await saveNews(await request.json());

    // broadcast the news on the socket
    io.emit("save-news", newsItem);

    return json({ newsItem }, { status: 201 });
};
