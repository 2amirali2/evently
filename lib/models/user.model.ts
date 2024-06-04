import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    familyName: { type: String },
    givenName: { type: String },
    picture: { type: String, required: true},
})

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User