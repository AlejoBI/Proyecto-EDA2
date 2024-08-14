import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true // removes whitespace from both ends of a string (a l e ja n d r o -> alejandro)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    }, 
    Timestamp: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("User", userSchema);