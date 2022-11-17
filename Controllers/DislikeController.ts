/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import { Express, Request, Response } from "express";
import IDislikeController from "../interfaces/IDislikeController";
import IDislikeDao from "../interfaces/IDislikeDao";
import ILikeDao from "../interfaces/ILikeDao";
import ITuitDao from "../interfaces/ITuitDao";


/**
 * @class DislikeController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes/:tid to record if a user dislikes a tuit
 *     </li>
 *     <li>PUT /api/users/:uid/dislikes/:tid to toggle a user dislikes a tuit
 *     </li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {TuitDao} tuitDao Singleton DAO implementing tuits CRUD operations
 * @property {DislikeController} DislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements IDislikeController {
    private dislikeDao: IDislikeDao;
    private likeDao: ILikeDao;
    private tuitDao: ITuitDao;

    /**
     * Constructor Creates controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return DislikeController
     */
    constructor(app: Express, dislikeDao: IDislikeDao, likeDao: ILikeDao, tuitDao: ITuitDao) {
        this.dislikeDao = dislikeDao;
        this.likeDao = likeDao;
        this.tuitDao = tuitDao;
        app.get("/api/users/:uid/dislikes/:tid", this.findUserDislikedTuit);
        app.put("/api/users/:uid/dislikes/:tid", this.userTogglesTuitDislikes);
    }

    /**
     * Check if the user has already disliked the tuit
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user, and the tid representing the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON object containing the dislike objects or null
     */
    findUserDislikedTuit = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === "me") {
            res.sendStatus(503);
            return;
        }
        this.dislikeDao.findUserDislikesTuit(userId, tid)
            .then(dislike => res.json(dislike));
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new dislikes that was inserted in the
     * database
     */
    userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === "me") {
            res.sendStatus(503);
            return;
        }
        try {
            const userAlreadyDislikedTuit = await this.dislikeDao.findUserDislikesTuit(userId, tid);
            const howManyDislikedTuit = await this.dislikeDao.countHowManyDisikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (tuit != null) {
                if (userAlreadyDislikedTuit != null) {
                    await this.dislikeDao.userUndoDislikeTuit(userId, tid);
                    tuit.stats.dislikes = howManyDislikedTuit - 1;
                    console.log("Dislike-controller", userAlreadyDislikedTuit);
                } else {
                    const userAlreadyLikedTuit = await this.likeDao
                        .findUserLikesTuit(userId, tid);
                    const howManyLikedTuit = await this.likeDao
                        .countHowManyLikedTuit(tid);
                    if (userAlreadyLikedTuit != null) {
                        await this.likeDao.userUnlikesTuit(userId, tid);
                        tuit.stats.likes = howManyLikedTuit - 1;
                        console.log("userAlreadyLikedTuit");
                    }
                    await this.dislikeDao.userDislikesTuit(userId, tid);
                    tuit.stats.dislikes = howManyDislikedTuit + 1;
                }
                await this.tuitDao.updateLikes(tid, tuit.stats);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }

        } catch (e) {
            res.sendStatus(404);
        }
    }
}
