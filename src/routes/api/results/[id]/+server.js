// @ts-nocheck
import { json } from "@sveltejs/kit";

import { updateResult, findResult, removeResult, updateStageTwo } from "$lib/server/db";
import { logger } from "$lib/server/logger.js";
import { io } from "$lib/socket-client";

export const GET = async ({ params }) => {
    return json(await findResult(params.id));
};

export const PUT = async ({ params, request }) => {
    logger.debug(`request.PUT ${params.id}`);
    const result = await updateResult(params.id, await request.json());

    // broadcast the updated result on the socket
    logger.debug(`broadcasting updated result: ${JSON.stringify(result)}`);
    io.emit("save-result", result);

    // search and replace stage2 tag
    if ("stage2Tag" in result && result.stage2Tag !== undefined) {
        logger.debug(`Searching for stage 2 target ${result.stage2Tag}`);
        var winner = result.homeTeam;
        if (result.awayPens > result.homePens || result.awayGoals > result.homeGoals) {
            winner = result.awayTeam;
        }
        const updated = await updateStageTwo(result.stage2Tag, winner);
        for (var i = 0; i < updated.length; i++) {
            logger.debug(`Emiting updated stage2 result ${JSON.stringify(updated[i])}`);
            io.emit("save-result", updated[i]);
        }
    }

    return json({ result }, { status: 201 });
};

export const DELETE = async ({ params }) => {
    const res = await removeResult(params.id);

    // broadcast the deleted result on the socket
    logger.debug(`broadcasting deleted result: ${params.id}`);
    io.emit("remove-result", params.id);

    return new Response(null, { status: 204 });
};
