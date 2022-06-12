import { Server } from "socket.io";

export default function injectSocketServer(server) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`New incoming socket connection from ${socket.id}`);

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });

        socket.on("save-result", (result) => {
            io.emit("result", result);
        });

        socket.on("remove-result", (result) => {
            io.emit("remove", result);
        });
    });

    console.log(`New socket server created`);
}
