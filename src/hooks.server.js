// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { acl } from "$lib/server/acl";

let authentication = SvelteKitAuth({
    providers: [
        GoogleProvider({
            clientId: GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        }),
    ],
});

let authorization = async ({ event, resolve }) => {
    const session = await event.locals.getSession();
    let role = "guest";

    if (session?.user?.role) {
        role = session.user.role;
    }

    let permission = await acl.can(role).execute(event.request.method).on(event.url.pathname);

    console.debug(`permission: ${JSON.stringify(permission)} is ${permission.granted ? "granted" : "denied"}`);
    if (!permission.granted) {
        if (event.request.headers.get("Accept") == /text\/json/) {
            return json({ message: "Forbidden" }, { status: 403 });
        } else {
            throw redirect(303, "/");
        }
    }

    return resolve(event);
};

export const handle = sequence(authentication, authorization);
