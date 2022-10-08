import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import ITuitController from "../interfaces/ITuitController";
import TuitDao from '../mongoose/TuitDao';

export default class TuitController implements ITuitController {

    private app: Express;
    private tuitDao: TuitDao;
    constructor(app: Express, tuitDao: TuitDao) {
        this.app = app;
        this.tuitDao = tuitDao;
        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tuitid', this.findTuitById);
        this.app.get('/user/:userid/tuits', this.findTuitsByUser);
        this.app.post('/tuits', this.createTuit);
        this.app.put('/tuits/:tuitid', this.updateTuit);
        this.app.delete('/tuits/:tuitid', this.deleteTuit);
    }


    findAllTuits = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuits = await this.tuitDao.findAllTuits();
        res.json(tuits);
    }
    findTuitById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.findTuitById(req.params.tuitid);
        res.json(tuit);
    }
    findTuitsByUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuits = await this.tuitDao.findTuitsByUser(req.params.userid);
        res.json(tuits);
    }
    createTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.createTuit(req.body);
        res.json(tuit);
    }
    updateTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.updateTuit(req.params.tuitid, req.body);
        res.json(tuit);
    }
    deleteTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.deleteTuit(req.params.tuitid);
        res.json(tuit);
    }
}