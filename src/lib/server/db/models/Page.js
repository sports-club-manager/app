import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    created: { type: Date, default: Date.now },
});

export const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);
