import { Server } from "socket.io";
import { eventbus } from "./eventbus.js";

export default function injectSocketServer(server) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`New incoming socket connection from ${socket.id}`);

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });

        socket.on("ping", (data) => {
            console.log(`ping from ${socket.id} : ${data}`);
            socket.emit("pong", {});
        });

    });

    console.log("New socket server created");
    
    // broadcast events off the bus
    eventbus.on("result", (result) => {
        console.debug("Emitting saved result to sockets", result);
        io.sockets.emit("result", result);
    });

    eventbus.on("remove-result", (result) => {
        logger.debug("Emitting deleted result to sockets", result);
        io.sockets.emit("remove", result);
    });

};
