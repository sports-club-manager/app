import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
    {
        competition: {
            name: { type: String, required: true },
            section: { type: String, required: true },
            group: { type: Number, min: 1 },
        },
        day: { type: Number, required: true },
        dateTime: { type: Number, required: true },
        duration: { type: String, required: true },
        pitch: { type: String, required: true },
        tag: { type: String, required: true },
        homeTeam: { type: String, required: true },
        awayTeam: { type: String, required: true },
        homeGoals: { type: Number, min: 0 },
        awayGoals: { type: Number, min: 0 },
        homePens: { type: Number, min: 0 },
        awayPens: { type: Number, min: 0 },

        // 'hidden' props
        stage2Tag: { type: String },
        homeTeamFrom: { type: String },
        awayTeamFrom: { type: String },
    },
    {
        optimisticConcurrency: true,
    }
);

export const Result = mongoose.model("Result", ResultSchema);
