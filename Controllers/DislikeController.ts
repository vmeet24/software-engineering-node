/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import { Express, Request, Response } from "express";
import IDislikeController from "../interfaces/IDislikeController";
import IDislikeDao from "../interfaces/IDislikeDao";
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
    private tuitDao: ITuitDao;

    /**
     * Constructor Creates controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return DislikeController
     */
    constructor(app: Express, dislikeDao: IDislikeDao, tuitDao: ITuitDao) {
        this.dislikeDao = dislikeDao;
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
        const dislikeDao = this.dislikeDao;
        const tuitDao = this.tuitDao;
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
            const userAlreadyLikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid);
            const howManyLikedTuit = await dislikeDao.countHowManyDisikedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (tuit != null) {
                if (userAlreadyLikedTuit) {
                    await dislikeDao.userUndoDislikeTuit(userId, tid);
                    tuit.stats.dislikes = howManyLikedTuit - 1;
                } else {
                    await this.dislikeDao.userDislikesTuit(userId, tid);
                    tuit.stats.dislikes = howManyLikedTuit + 1;
                }
                await tuitDao.updateLikes(tid, tuit.stats);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }

        } catch (e) {
            res.sendStatus(404);
        }
    }
}
