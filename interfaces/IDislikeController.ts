import { Request, Response } from "express";

export default interface DislikeControllerI {
    findUserDislikedTuit(req: Request, res: Response): void;
    userTogglesTuitDislikes(req: Request, res: Response): void;
};