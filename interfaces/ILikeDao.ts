/**
 * @file Declares API for Follows related data access object methods
 */

import Like from "../models/Like";

export default interface ILikeDao {
    findAllUsersThatLikedTuit(tid: string): Promise<Like[]>;
    findAllTuitsLikedByUser(uid: string): Promise<Like[]>;
    userLikesTuit(tid: string, uid: string): Promise<Like>;
    findUserLikesTuit(uid: string, tid: string): Promise<Like | null>;
    countHowManyLikedTuit(tid: string): Promise<number>;
    userUnlikesTuit(tid: string, uid: string): Promise<any>;
};