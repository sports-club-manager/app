import { updateStageTwo } from "$lib/db";
import { io } from "$lib/socket-client";

export const post = async ({ params, request }) => {
    const prefix = `${params.competition}_${params.section}_G${params.group}_P`;
    const table = await request.json();
    console.debug(`Resolving stage 2 placeholders for ${prefix} and team names ${JSON.stringify(table)}`);

    for (let k in table) {
        if (table.hasOwnProperty(k) && !isNaN(k)) {
            const source = prefix + (parseInt(k) + 1);
            const updated = await updateStageTwo(source, table[k]);
            for (var i = 0; i < updated.length; i++) {
                console.debug(`Emiting updated stage2 result ${JSON.stringify(updated[i])}`);
                io.emit("save-result", updated[i]);
            }
        }
    }

    return {
        status: 200
    };
};
