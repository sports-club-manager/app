import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    providerId: String,
    providerName: String,
    email: String,
    photo: String,
    displayName: String,
    roles: [String],
});

export const User = mongoose.model("User", UserSchema);
