// @ts-nocheck
/*
 * sets up the socket server in a custom HTTP server for production
 */
import { handler } from "./handler.js";
import { createServer } from "http";
import express from "express";
import injectSocketServer from "./socket-server.js";

const app = express();
const httpServer = createServer(app);
injectSocketServer(httpServer);

app.disable("x-powered-by");

// let SvelteKit handle everything, including serving prerendered pages and static assets
app.use(handler);

// fallback error handler
app.use((err, req, res) => {
    var e = app.get("env") === "development" ? err : {};
    logger.error(err);
    res.status(err.status || 500).json({
        message: err.message,
        error: e,
    });
});

httpServer.listen(process.env.PORT || 3000, "0.0.0.0");
