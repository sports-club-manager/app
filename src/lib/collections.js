import moment from "moment-timezone";

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

export const time = (dateTime) => moment(dateTime).tz(tz).format("HH:mm");

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
