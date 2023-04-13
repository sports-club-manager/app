import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    created: { type: Date, default: Date.now },
});

export const News = mongoose.models.News || mongoose.model("News", NewsSchema);
