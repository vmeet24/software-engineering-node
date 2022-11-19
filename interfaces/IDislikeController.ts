/**
 * @file Declares controller RESTful API for Dislikes resource
 */

import { Request, Response } from "express";

export default interface DislikeControllerI {
    findAllTuitsDislikedByUser(req: Request, res: Response): void;
    findUserDislikedTuit(req: Request, res: Response): void;
    userTogglesTuitDislikes(req: Request, res: Response): void;
};