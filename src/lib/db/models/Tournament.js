import mongoose from "mongoose";

const CompetitionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        section: { type: String, required: true },
        groups: { type: Number, default: 0 },
    },
    {
        id: false,
    }
);

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    club: String,
    siteUrl: String,
    competitions: [CompetitionSchema],
});

export const Tournament = mongoose.model("Tournament", TournamentSchema);
