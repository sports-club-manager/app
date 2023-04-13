import ioClient from "socket.io-client";

const baseUrl = import.meta.env.VITE_HOST_URL;

// @ts-ignore
const socket = ioClient(baseUrl, { "connect timeout": 5000 });

socket.on("connect", () => {
    console.log(`Client socket connected with ID: ${socket.id}`);
});

socket.on("connect_error", (error) => {
    console.error("Failed to connect client socket", error);
});

socket.on("error", (error) => {
    console.error("Error on client socket", error);
});

export const io = socket;
