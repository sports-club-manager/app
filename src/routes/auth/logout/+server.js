export const get = async ({ request }) => {
    return {
        status: 302,
        headers: {
            location: "/",
            "Set-Cookie": "jwt=deleted;Max-Age=0;Path=/;HttpOnly;",
        },
    };
};
