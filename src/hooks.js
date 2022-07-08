import cookie from "cookie";
import jwt_decode from "jwt-decode";

export const handle = async ({ event, resolve }) => {
    const cookieHdr = event.request.headers.get("cookie") || "";

    // get jwt from cookie if exists and add to locals
    event.locals.jwt = cookie.parse(cookieHdr)["jwt"];

    const response = await resolve(event);
    return response;
};

export const getSession = (event) => {
    let session = { user: {} };

    // decode the jwt and add the user to the session
    if (event.locals.jwt) {
        let decoded = jwt_decode(event.locals.jwt);
        session.user = {
            name: decoded.name,
            email: decoded.email,
            photo: decoded.photo,
            roles: decoded.roles,
        };
    }

    return session;
};
