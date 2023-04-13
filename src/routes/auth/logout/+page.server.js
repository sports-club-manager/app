export const load = async ({ request }) => {
    return new Response("", {
        status: 302,
        headers: {
            location: "/",
            "Set-Cookie": "jwt=deleted;Max-Age=0;Path=/;HttpOnly;",
        },
    });
};
