import http from "http";
import { handler } from "./build/handler.js";
import injectSocketServer from "./src/lib/socket-server.js";
import express from "express";

const app = express();
const server = http.createServer(app);

// Inject SocketIO
injectSocketServer(server);

// SvelteKit handlers
app.use(handler);

let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Running on http://${process.env.HOST || "localhost"}:${port}`);
});
