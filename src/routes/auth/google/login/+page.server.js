import { authClient } from "$lib/server/auth";

const url = authClient.generateAuthUrl({
    scope: ["email", "profile"],
});

export const load = async ({ request }) => {
    return {
        status: 302,
        headers: {
            location: url,
        },
    };
};
