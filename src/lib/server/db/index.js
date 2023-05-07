import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import { MONGO_URI, NODE_ENV } from "$env/static/private";

import { Tournament } from "$lib/server/db/models/Tournament";
import { Result } from "$lib/server/db/models/Result";
import { News } from "$lib/server/db/models/News";
import { Page } from "$lib/server/db/models/Page";
import { logger } from "$lib/server/logger";

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

export const findResults = async () => {
    return await Result.find({});
};

export const findResultsByDay = async (day) => {
    if (isNaN(day)) day = 1;
    logger.debug(`Result search for day ${day}..`);
    return await Result.find({ day: day });
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
    logger.debug(`Updating ${source} to ${target}`);
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
    return await News.find().sort({ created: "desc" });
};

export const saveNews = async (news) => {
    logger.debug(`Saving ${JSON.stringify(news)}`);
    return await News.create(news);
};

export const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// --------------------------------------------------------------------------
// setup
// --------------------------------------------------------------------------
let client;
let clientPromise = Promise;

if (NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGO_URI, mongoOptions);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(MONGO_URI, mongoOptions);
    clientPromise = client.connect();
}

export const dbClientPromise = clientPromise;

(async () => {
    try {
        mongoose.connect(MONGO_URI, mongoOptions);

        mongoose.connection.on("connected", () => {
            logger.info(`Mongoose connected`);
        });

        mongoose.connection.on("error", (err) => {
            logger.error(`Mongoose connection error: ${err}`);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("Mongoose disconnection event");
        });

        mongoose.connection.on("reconnected", () => {
            logger.warn("Mongoose reconnection event");
        });

        const dbShutdown = (msg, callback) => {
            mongoose.connection.close(() => {
                logger.debug(`Mongoose disconnected through ${msg}`);
                callback();
            });
        };
    } catch (err) {
        logger.error(err);
    }
})();
