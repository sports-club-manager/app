import { sveltekit } from "@sveltejs/kit/vite";
import injectSocketServer from "./src/lib/socket-server.js";

/** @type {import('vite').UserConfig} */
const config = {
    resolve: {
        alias: {
            "xmlhttprequest-ssl": "./node_modules/engine.io-client/lib/xmlhttprequest.js",
        },
    },
    plugins: [
        sveltekit(),
        {
            name: "sveltekit-socket-io",
            configureServer(server) {
                injectSocketServer(server.httpServer);
            },
        },
    ],
};

export default config;
