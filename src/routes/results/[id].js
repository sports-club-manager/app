import { updateResult, findResult, removeResult, updateStageTwo } from "$lib/db";
import { io } from "$lib/socket-client";

export const get = async ({ params }) => {
    return {
        body: await findResult(params.id),
    };
};

export const put = async ({ params, request }) => {
    console.log(`request.PUT ${params.id}`);
    const result = await updateResult(params.id, await request.json());

    // broadcast the updated result on the socket
    console.log(`broadcasting updated result: ${result}`);
    io.emit("save-result", result);

    // search and replace stage2 tag
    if ("stage2Tag" in result && result.stage2Tag !== undefined) {
        console.debug(`Searching for stage 2 target ${result.stage2Tag}`);
        var winner = result.homeTeam;
        if (result.awayPens > result.homePens || result.awayGoals > result.homeGoals) {
            winner = result.awayTeam;
        }
        const updated = await updateStageTwo(result.stage2Tag, winner);
        for (var i = 0; i < updated.length; i++) {
            console.debug(`Emiting updated stage2 result ${JSON.stringify(updated[i])}`);
            io.emit("save-result", updated[i]);
        }
    }

    return {
        status: 200,
        body: result,
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
