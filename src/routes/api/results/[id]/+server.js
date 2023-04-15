// @ts-nocheck
import { updateResult, findResult, removeResult, updateStageTwo } from "$lib/server/db";
import { io } from "$lib/socket-client";
import { json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
    return json(await findResult(params.id));
};

export const PUT = async ({ params, request }) => {
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

    return json({ result }, { status: 201 });
};

export const DELETE = async ({ params }) => {
    const res = await removeResult(params.id);

    // broadcast the deleted result on the socket
    console.log(`broadcasting deleted result: ${params.id}`);
    io.emit("remove-result", params.id);

    return new Response(null, { status: 204 });
};
