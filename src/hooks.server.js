// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { json } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } from "$env/static/private";

import { permitted } from "$lib/server/acl";
import { dbClientPromise } from "$lib/server/db";
import { logger } from "$lib/server/logger";

let authentication = SvelteKitAuth({
    trustHost: true,
    adapter: MongoDBAdapter(dbClientPromise),
    providers: [
        GoogleProvider({
            clientId: GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
            profile(profile) {
                logger.debug("Profile received from provider or database:");
                logger.debug(profile);
                return {
                    id: profile.email,
                    username: profile.email,
                    email: profile.email,
                    role: profile.role ?? "guest",
                    image: profile.picture,
                    name: profile.name,
                };
            },
        }),
    ],
    callbacks: {
        session({ session, user }) {
            if (session && user) session.user = user;
            return session;
        },
    },
});

let authorization = async ({ event, resolve }) => {
    const session = await event.locals.getSession();
    const role = session?.user?.role || "guest";
    
    let allowed = await permitted(role, event.request.method, event.url.pathname);

    if (!allowed) {
        const email = session?.user?.email || "unknown";
        if (event.request.headers.get("Accept") == /text\/json/) {
            logger.error(`[${role}:${email}] denied access to ${event.url.pathname}, sending 403`);
            return json({ message: "Forbidden" }, { status: 403 });
        } else {
            logger.error(`[${role}:${email}] denied access to ${event.url.pathname}, redirecting via 303 to /`);
            throw redirect(303, "/");
        }
    }

    return resolve(event);
};

export const handle = sequence(authentication, authorization);
