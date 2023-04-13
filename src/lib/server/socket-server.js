import { Server } from "socket.io";

/**
 * @param {Partial<import("socket.io").ServerOptions> | undefined} server
 */
export default function injectSocketServer(server) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`New incoming socket connection from ${socket.id}`);

        socket.on("disconnect", () => {
            console.log("user disconnected");
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

    console.log(`New socket server created`);
}
