import { sveltekit } from "@sveltejs/kit/vite";
import injectSocketServer from "./src/lib/server/socket-server.js";
import { defineConfig } from "vite";

export default defineConfig({
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
});
