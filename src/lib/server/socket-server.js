import { Server } from "socket.io";

import { logger } from "./logger.js";

/**
 * @param {Partial<import("socket.io").ServerOptions> | undefined} server
 */
export default function injectSocketServer(server) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        logger.debug(`New incoming socket connection from ${socket.id}`);

        socket.on("disconnect", () => {
            logger.debug("user disconnected");
        });

        /*
         * simply propagate all events to all clients
         */

        socket.on("save-result", (result) => {
            io.emit("save-result", result);
        });

        socket.on("remove-result", (result) => {
            io.emit("remove-result", result);
        });

        socket.on("save-news", (result) => {
            io.emit("save-news", result);
        });
    });

    logger.info(`New socket server created`);
}
