import { authClient, buildTokenFor } from "$lib/server/auth";
import { findOrCreateUser } from "$lib/server/db";

export const load = async ({ url }) => {
    const code = url.searchParams.get("code");

    if (code) {
        const { tokens } = await authClient.getToken(code);
        authClient.setCredentials(tokens);

        const { data: profileData } = await authClient.request({
            url: "https://www.googleapis.com/oauth2/v1/userinfo",
            method: "GET",
        });

        profileData.provider = "google";

        const user = await findOrCreateUser(profileData);
        const jwt = buildTokenFor(user);

        return {
            status: 302,
            headers: {
                location: "/",
                "Set-Cookie": `jwt=${jwt};Path=/;HttpOnly;`,
            },
        };
    }
};
