import mongoose from "mongoose";
import { browser } from "$app/env";

import { Tournament } from "$lib/db/models/Tournament";
import { Result } from "$lib/db/models/Result";
import { News } from "$lib/db/models/News";
import { Page } from "$lib/db/models/Page";
import { User } from "$lib/db/models/User";

// --------------------------------------------------------------------------
// tournament data
// --------------------------------------------------------------------------
export const findTournament = async () => {
    return await Tournament.findOne();
};

// --------------------------------------------------------------------------
// result data
// --------------------------------------------------------------------------
export const findResult = async (id) => {
    return await Result.findById(id);
};

export const findResultsByAgeGroup = async (name) => {
    return await Result.find({ "competition.name": name });
};

export const findResultsByAgeGroupAndSection = async (name, section) => {
    return await Result.find({ "competition.name": name, "competition.section": section });
};

export const updateResult = async (id, result) => {
    const updated = await Result.findOneAndReplace({ _id: id }, result, {
        upsert: true,
        new: true,
    });

    return updated;
};

export const updateStageTwo = async (source, target) => {
    console.debug(`Updating ${source} to ${target}`);
    await Result.updateMany({ homeTeamFrom: source }, { $set: { homeTeam: target } });
    await Result.updateMany({ awayTeamFrom: source }, { $set: { awayTeam: target } });
    return Result.find({ $or: [{ homeTeamFrom: source }, { awayTeamFrom: source }] });
};

export const removeResult = async (id) => {
    // TODO: implement deletion
};

// --------------------------------------------------------------------------
// infopage data
// --------------------------------------------------------------------------
export const findPage = async (title) => {
    return await Page.findOne({ title: title });
};

export const getPageList = async () => {
    return await Page.find({}, "title");
};

// --------------------------------------------------------------------------
// news data
// --------------------------------------------------------------------------
export const getNews = async () => {
    return await News.find();
};

export const saveNews = async (news) => {
    return await News.create();
};

// --------------------------------------------------------------------------
// setup
// --------------------------------------------------------------------------
let mongoUri = import.meta.env.VITE_MONGO_URI || "mongodb://localhost/scm-dev";
let mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

if (!browser) {
    (async () => {
        try {
            mongoose.connect(mongoUri, mongoOptions);

            mongoose.connection.on("connected", () => {
                console.info(`Mongoose connected to ${mongoUri}`);
            });

            mongoose.connection.on("error", (err) => {
                console.error(`Mongoose connection error: ${err}`);
            });

            mongoose.connection.on("disconnected", () => {
                console.warn("Mongoose disconnection event");
            });

            mongoose.connection.on("reconnected", () => {
                console.warn("Mongoose reconnection event");
            });

            const dbShutdown = (msg, callback) => {
                mongoose.connection.close(() => {
                    console.debug(`Mongoose disconnected through ${msg}`);
                    callback();
                });
            };
        } catch (err) {
            console.error(err);
        }
    })();
}
