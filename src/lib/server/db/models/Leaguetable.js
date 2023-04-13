import mongoose from "mongoose";

export const Leaguetable = mongoose.models.Leaguetable || mongoose.model("Leaguetable", new mongoose.Schema({}));
