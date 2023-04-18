import { AccessControl } from "role-acl";

const _acl = new AccessControl();

_acl.grant({
    role: "guest",
    action: ["GET"],
    resource: "*",
    attributes: ["*"],
});

_acl.grant({
    role: "scorer",
    action: ["PUT"],
    resource: "/api/results/*",
    attributes: ["*"],
});

_acl.grant({
    role: "editor",
    action: ["*", "!DELETE"],
    resource: "/api/results/*",
    attributes: ["*"],
});

_acl.grant({
    role: "editor",
    action: ["*", "!DELETE"],
    resource: "/api/news",
    attributes: ["*"],
});

_acl.grant({
    role: "admin",
    action: "*",
    resource: "*",
    attributes: ["*"],
});

_acl.extendRole("scorer", "guest");
_acl.extendRole("editor", "scorer");
_acl.extendRole("admin", "editor");

export const acl = _acl;
