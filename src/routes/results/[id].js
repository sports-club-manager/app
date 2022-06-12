import { updateResult, findResult, removeResult } from "$lib/db";
import { io } from "$lib/socket-client";

export const get = async ({ params }) => {
    return {
        body: await findResult(params.id),
    };
};

export const put = async ({ params, request }) => {
    console.log(`request.PUT ${params.id}`);
    const updated = await updateResult(params.id, await request.json());

    // broadcast the updated result on the socket
    console.log(`broadcasting updated result: ${updated}`);
    io.emit("save-result", updated);

    return {
        status: 200,
        body: updated,
    };
};

export const del = async ({ params }) => {
    const res = await removeResult(params.id);

    // broadcast the deleted result on the socket
    console.log(`broadcasting deleted result: ${params.id}`);
    io.emit("remove-result", params.id);

    return {
        status: 204,
    };

    // TODO: fix
    return {
        error: "oops",
    };
};
