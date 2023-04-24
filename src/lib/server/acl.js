// @ts-nocheck
import { AccessControl } from "role-acl";
import { logger } from "$lib/server/logger";

const acl = new AccessControl();

acl.grant({
    role: "guest",
    action: ["GET"],
    resource: "*",
    attributes: ["*"],
});

acl.grant({
    role: "scorer",
    action: ["PUT"],
    resource: "/api/results/*",
    attributes: ["*"],
});

acl.grant({
    role: "editor",
    action: ["*", "!DELETE"],
    resource: "/api/results/*",
    attributes: ["*"],
});

acl.grant({
    role: "editor",
    action: ["*", "!DELETE"],
    resource: "/api/news",
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

    logger.debug(`${action} on permission: ${JSON.stringify(permission)} is ${permission.granted ? "granted" : "denied"}`);

    return permission.granted;
};
