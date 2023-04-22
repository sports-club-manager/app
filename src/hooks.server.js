// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, MONGO_URI, NODE_ENV } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { acl } from "$lib/server/acl";
import { mongoOptions } from "$lib/server/db";

let client;
let clientPromise = Promise;

if (NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGO_URI, mongoOptions);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(MONGO_URI, mongoOptions);
    clientPromise = client.connect();
}

let authentication = SvelteKitAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
            profile(profile) {
                console.debug(profile);
                return {
                    id: profile.email,
                    email: profile.email,
                    role: profile.role ?? "guest",
                    image: profile.picture,
                    name: profile.name
                };
            },
        }),
    ],
    callbacks: {
      session({ session, user }) {
        if (session && user) session.user = user;
        return session
      }
    }
});

let authorization = async ({ event, resolve }) => {
    const session = await event.locals.getSession();

    console.debug(session?.user);
    let permission = await acl.can(session?.user?.role || "guest").execute(event.request.method).on(event.url.pathname);

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
