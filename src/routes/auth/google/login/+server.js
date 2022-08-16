import { authClient } from "$lib/auth";

const url = authClient.generateAuthUrl({
    scope: ["email", "profile"],
});

export const GET = async ({ request }) => {
    return {
        status: 302,
        headers: {
            location: url,
        },
    };
};
