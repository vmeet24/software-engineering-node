/**
 * @file Declares controller RESTful API for Likes resource
 */

import { Request, Response } from "express";

export default interface ILikeController {
    findAllUsersThatLikedTuit(req: Request, res: Response): void;
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    userTogglesTuitLikes(req: any, res: any): void;
}