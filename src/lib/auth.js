import { google } from "googleapis";
import { dev } from "$app/env";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const jwtSecret = dev ? "s3cr3t!" : crypto.randomBytes(64).toString("base64").slice(0, 64);
const jwtExpiresAfter = (process.env.AUTH_JWT_EXPIRES_IN_MINUTES || 30) * 60;

export const buildTokenFor = (user) => {
    console.debug(`Creating jwt for ${user.email}`);
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            name: user.displayName,
            photo: user.photo,
            roles: user.roles,
        },
        jwtSecret,
        { expiresIn: jwtExpiresAfter }
    );
};

export const authClient = new google.auth.OAuth2(
    import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_SECRET,
    `${import.meta.env.VITE_HOST_URL}/auth/google/callback`
);
