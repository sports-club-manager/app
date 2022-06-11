import preprocess from "svelte-preprocess";
import node from "@sveltejs/adapter-node";
import injectSocketServer from "./src/lib/socket-server.js";

/**
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
    preprocess: preprocess(),

    kit: {
        adapter: node(),

        vite: {
            resolve: {
                alias: {
                    "xmlhttprequest-ssl": "./node_modules/engine.io-client/lib/xmlhttprequest.js",
                },
            },
            plugins: [
                {
                    name: "sveltekit-socket-io",
                    configureServer(server) {
                        injectSocketServer(server.httpServer);
                    },
                },
            ],
        },
    },
};

export default config;
