/**
 * @file Controller RESTful Web service API for follows resource
 */

import { Express, Request, Response } from "express";
import IFollowController from "../interfaces/IFollowController";
import IFollowDao from "../interfaces/IFollowDao";

/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/follows to retrieve a list of users user is following
 *     </li>
 *     <li>GET /api/users/:uid/followers to retrieve a list of users that are following the user
 *     </li>
 *     <li>POST /api/users/:source_uid/follows/:target_uid to record that a user follows another user
 *     </li>
 *     <li>DELETE /api/users/:source_uid/follows/:target_uid to record that a user unfollows another user
 *     </li>
 *     <li>DELETE /api/users/:uid/follows to unfollow all other users
 *     </li>
 *     <li>DELETE /api/users/:uid/followers to remove all the followers
 *     </li>
 * </ul>
 * @property {IFollowDao} followDao DAO implementing follows CRUD operations
 * RESTful Web service API
 */
export default class FollowController implements IFollowController {
    private app: Express;
    private followDao: IFollowDao;

    /**
    * Creates controller instance
    * @param {IFollowDao} followDao DAO implementing follows CRUD operations
    * @param {Express} app Express instance to declare the RESTful Web service
    * API
    * @return FollowController
    */
    constructor(app: Express, followDao: IFollowDao) {
        this.app = app;
        this.followDao = followDao;
        this.app.get("/api/users/:uid/follows", this.findAllUsersThatUserIsFollowing);
        this.app.get("/api/users/:uid/followers", this.findAllUsersThatUserIsFollowedBy);
        this.app.post("/api/users/:uid/follows/:targetid", this.userFollowsAnotherUser);
        this.app.delete("/api/users/:uid/follows/:targetid", this.userUnFollowsAnotherUser);
    }

    findAllUsersThatUserIsFollowing = async (req: Request, res: Response) => {
        const users = await this.followDao.findAllUsersThatUserIsFollowing(req.params.uid);
        res.json(users);
    }
    findAllUsersThatUserIsFollowedBy = async (req: Request, res: Response) => {
        const users = await this.followDao.findAllUsersThatUserIsFollowedBy(req.params.uid);
        res.json(users);
    }
    userFollowsAnotherUser = async (req: Request, res: Response) => {
        const follow = await this.followDao.userFollowsAnotherUser(req.params.uid, req.params.targetid);
        res.json(follow);
    }
    userUnFollowsAnotherUser = async (req: Request, res: Response) => {
        const follow = await this.followDao.userUnFollowsAnotherUser(req.params.uid, req.params.targetid);
        res.json(follow);
    }
}