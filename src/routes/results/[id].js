import { updateResult, findResult, removeResult } from "$lib/db";
import { eventbus } from "$lib/eventbus";

export const get = async ({ params }) => {
    return {
        body: await findResult(params.id),
    };
};

export const put = async ({ params, request }) => {
    console.log(`request.PUT ${params.id}`);
    const updated = await updateResult(params.id, await request.json());

    // broadcast the updated result on the socket
    console.log(`emitting updated result to eventbus: ${updated}`);
    eventbus.emit("result", updated);

    return {
        status: 200,
        body: updated,
    };
};

export const del = async ({ params }) => {
    const res = await removeResult(params.id);

    if (res.acknowledged) {
        // broadcast the deleted result on the socket
        console.log(`emitting deleted result to eventbus: ${id}`);
        eventbus.emit("remove-result", id);

        return {
            status: 204,
        };
    }

    // TODO: fix
    return {
        error: "oops",
    };
};
