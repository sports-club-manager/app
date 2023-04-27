// @ts-nocheck
import moment from "moment-timezone";
import { io } from "$lib/socket-client";

/*
 * sort a collection of results by dateTime (most recent first)
 */
export const dateTimeSort = (a, b) => {
    if (a.dateTime < b.dateTime) return -1;
    if (a.dateTime > b.dateTime) return 1;
    return a.tag < b.tag ? -1 : 1;
};

// TODO: externalise TZ
export const time = (dateTime) => moment(dateTime).tz("Europe/London").format("HH:mm");

/* TODO - can this be made to work?
export const saveRemoveResults = (results) => {
    console.debug("Mounted saveRemoveResults");
    io.on("save-result", (result) => {
        console.debug("Received result", result);
        for (let i = 0; i < results.length; i++) {
            if (results[i]._id == result._id) {
                console.debug(`Found result to update: ${i}`);
                results[i] = result;
                break;
            }
        }
    });

    io.on("remove-result", (resultId) => {
        console.debug("Result deleted", resultId);
        for (let i = 0; i < results.length; i++) {
            if (results[i]._id == resultId) {
                console.debug(`Found result to remove: ${i}`);
                results.splice(i, 1);
                break;
            }
        }
    });
};
*/
