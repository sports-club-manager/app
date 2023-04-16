// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

let authorization = async ({ event, resolve }) => {
    // Protect any routes under /authenticated
    if (event.url.pathname.startsWith("/authenticated")) {
        const session = await event.locals.getSession();
        if (!session) {
            throw redirect(303, "/auth");
        }
    }

    // If the request is still here, just proceed as normally
    return resolve(event);
};

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle = sequence(
    SvelteKitAuth({
        providers: [
            GoogleProvider({
                clientId: GOOGLE_OAUTH_CLIENT_ID,
                clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
            }),
        ],
    }),
    authorization
);
