import { getNews, saveNews } from "$lib/db";
import { io } from "$lib/socket-client";

export const get = async () => {
    return {
        body: { _news: await getNews() },
    };
};

export const post = async (news) => {
    const newsItem = await saveNews(news);
    // broadcast the news on the socket
    io.emit("save-news", newsItem);
    
    return {
        headers: {
            status: 201
        }, 
        body: {}
    };
};
