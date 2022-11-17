/**
 * @file Implements mongoose schema for tuits
 */
import mongoose from "mongoose";

/**
 * @typedef Tuit Represents the tuit object
 * @property {string} tuit The content of the tuit
 * @property {ObjectId} postedBy The user that posted the tuit
 * @property {date} postedOn The date the tuit is posted
 * reply, retuit, and like
 */
const TuitSchema = new mongoose.Schema({
    tuit: { type: String, required: true },
    postedOn: { type: Date, default: Date.now },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    stats: {
        replies: { type: Number, default: 0 },
        retuits: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 }
    }

}, { collection: 'tuits' });

export default TuitSchema;