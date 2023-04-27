// @ts-nocheck
import { AccessControl } from "role-acl";
import { logger } from "$lib/server/logger";

const acl = new AccessControl();

acl.grant({
    role: "guest",
    action: ["GET"],
    resource: ["/", "/socket.io/*", "/favicon.ico", "/api/*", "/news", "/pages/*", "/competitions/*"],
    attributes: ["*"],
});

acl.grant({
    role: "scorer",
    action: ["PUT"],
    resource: "/api/results/*",
    attributes: ["*"],
});

acl.grant({
    role: "scorer",
    action: ["GET"],
    resource: "/admin/results",
    attributes: ["*"],
});

acl.grant({
    role: "editor",
    action: ["*", "!DELETE"],
    resource: ["/api/results/*", "/api/news", "/api/pages"],
    attributes: ["*"],
});

acl.grant({
    role: "admin",
    action: "*",
    resource: "*",
    attributes: ["*"],
});

acl.extendRole("scorer", "guest");
acl.extendRole("editor", "scorer");
acl.extendRole("admin", "editor");

export const permitted = async (role, action, resource) => {
    let permission = await acl.can(role).execute(action).on(resource);

    logger.debug(`${action} on ${resource} by ${role} is ${permission.granted ? "granted" : "** DENIED **"}`);

    return permission.granted;
};
