/*
 * sets up the socket server in a custom HTTP server for production
 */
import { handler } from "./handler.js";
import { createServer } from "http";
import express from "express";
import compression from "compression";
import injectSocketServer from "./socket-server.js";
import { logger } from "./logger.js";

const app = express();
const httpServer = createServer(app);
injectSocketServer(httpServer);

app.disable("x-powered-by");
app.use(compression());

// let SvelteKit handle everything, including serving prerendered pages and static assets
app.use(handler);

// fallback error handler
app.use((err, req, res) => {
    logger.error(err);
    res.status(err.status || 500).json({
        message: err.message,
    });
});

httpServer.listen(process.env.PORT || 3000, "0.0.0.0");
