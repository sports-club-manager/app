// @ts-nocheck
import moment from "moment-timezone";
//import { io } from "$lib/socket-client";

/*
 * sort a collection of results by dateTime (most recent first), then tag, then pitch
 */
export const dateTimeSort = (a, b) => {
    if (a?.dateTime < b?.dateTime) return -1;
    if (a?.dateTime > b?.dateTime) return 1;
    if (a?.tag < b?.tag) return -1;
    if (a?.tag > b?.tag) return 1;
    if (a?.pitch < b?.pitch) return -1;
    if (a?.pitch > b?.pitch) return 1;
    return 0;
};

// TODO: externalise TZ
export const time = (dateTime) => moment(dateTime).tz("Europe/London").format("HH:mm");

export const homeScore = (res) => {
    if ("homeGoals" in res && res.homeGoals >= 0) {
        return res.homeGoals + (res.awayPens || res.homePens ? "(" + res.homePens + ")" : "");
    } else {
        return "";
    }
};

export const awayScore = (res) => {
    if ("awayGoals" in res && res.awayGoals >= 0) {
        return (res.awayPens || res.homePens ? "(" + res.awayPens + ")" : "") + res.awayGoals;
    } else {
        return "";
    }
};

/* TODO - can this be made to work?
export const saveRemoveResults = (results) => {
    console.debug("Mounted saveRemoveResults");
    io.on("save-result", (result) => {
        console.debug("Received result", result);
        for (let i = 0; i < results.length; i++) {
            if (results[i]._id == result._id) {
                results[i] = result;
                break;
            }
        }
    });

    io.on("remove-result", (resultId) => {
        console.debug("Result deleted", resultId);
        for (let i = 0; i < results.length; i++) {
            if (results[i]._id == resultId) {
                results.splice(i, 1);
                break;
            }
        }
    });
};
*/
