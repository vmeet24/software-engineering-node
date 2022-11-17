/**
 * @file Implements DAO managing data storage of dislikes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */

import IDislikeDao from "../interfaces/IDislikeDao";
import Dislike from "../models/Dislike";
import DislikeModel from "./DislikeModel";


/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of Dislikes
 * @implements {IDislikeDao} IDislikeDao
 */
export default class DislikeDao implements IDislikeDao {

    /**
     * Inserts dislike instance into the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when dislike is inserted into the database
     */
    async userDislikesTuit(uid: string, tid: string): Promise<Dislike> {
        return DislikeModel.create({ tuit: tid, dislikedBy: uid });
    }

    /**
     * Remove dislike instance from the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when dislike is removed from the database
     */
    async userUndoDislikeTuit(uid: string, tid: string): Promise<any> {
        return DislikeModel.deleteOne({ tuit: tid, dislikedBy: uid });
    }

    /**
     * Check if the user has already disliked the tuit
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when dislike by given user is retrived from the database
     */
    async findUserDislikesTuit(uid: string, tid: string): Promise<any> {
        return DislikeModel.findOne({ tuit: tid, dislikedBy: uid });
    }

    /**
     * Count how many dislikes this tuit has
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when dislike count is retrieved from the database
     */
    async countHowManyDisikedTuit(tid: string): Promise<any> {
        return DislikeModel.count({ tuit: tid });
    }

}