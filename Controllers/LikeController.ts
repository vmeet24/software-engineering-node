/**
 * @file Controller RESTful Web service API for likes resource
 */
import { Express, Request, Response } from "express";
import IDislikeDao from "../interfaces/IDislikeDao";
import ILikeController from "../interfaces/ILikeController";
import ILikeDao from "../interfaces/ILikeDao";
import ITuitDao from "../interfaces/ITuitDao";

/**
 * @class TuitController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {ILikeDao} likeDao DAO implementing likes CRUD operations
 * @property {Express} app Express instance to declare the RESTful Web service
 * RESTful Web service API
 */
export default class LikeController implements ILikeController {
    private likeDao: ILikeDao;
    private dislikeDao: IDislikeDao;
    private app: Express;
    private tuitDao: ITuitDao;
    /**
     * Creates controller instance
     * @param {ILikeDao} likeDao DAO implementing likes CRUD operations
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    constructor(app: Express, likeDao: ILikeDao, dislikeDao: IDislikeDao, tuitDao: ITuitDao) {
        this.app = app;
        this.likeDao = likeDao;
        this.tuitDao = tuitDao;
        this.dislikeDao = dislikeDao;
        this.app.get("/api/users/:uid/likes", this.findAllTuitsLikedByUser);
        this.app.get("/api/tuits/:tid/likes", this.findAllUsersThatLikedTuit);
        this.app.put("/api/users/:uid/likes/:tid", this.userTogglesTuitLikes);
    }

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatLikedTuit = async (req: Request, res: Response) => {
        const users = await this.likeDao.findAllUsersThatLikedTuit(req.params.tid)
        res.json(users);
    }


    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = async (req: Request, res: Response) => {
        const tuits = await this.likeDao.findAllTuitsLikedByUser(req.params.uid)
        res.json(tuits);
    }

    /**
     * Method to toggle the likes button.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userTogglesTuitLikes = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await this.likeDao
                .findUserLikesTuit(userId, tid);
            const howManyLikedTuit = await this.likeDao
                .countHowManyLikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (tuit != null) {
                if (userAlreadyLikedTuit != null) {
                    await this.likeDao.userUnlikesTuit(userId, tid);
                    tuit.stats.likes = howManyLikedTuit - 1;
                    console.log("Like-controller", userAlreadyLikedTuit);
                } else {
                    const userAlreadyDislikedTuit = await this.dislikeDao
                        .findUserDislikesTuit(userId, tid);
                    const howManyDislikedTuit = await this.dislikeDao
                        .countHowManyDisikedTuit(tid);
                    if (userAlreadyDislikedTuit != null) {
                        await this.dislikeDao.userUndoDislikeTuit(userId, tid);
                        tuit.stats.dislikes = howManyDislikedTuit - 1;
                        console.log("userAlreadyDislikedTuit");
                    }
                    await this.likeDao.userLikesTuit(userId, tid);
                    tuit.stats.likes = howManyLikedTuit + 1;
                }
                await this.tuitDao.updateLikes(tid, tuit.stats);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(404);
        }
    }
};