import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import ITuitController from "../interfaces/ITuitController";
import ITuitDao from "../interfaces/ITuitDao";

export default class TuitController implements ITuitController {

    private app: Express;
    private tuitDao: ITuitDao;
    constructor(app: Express, tuitDao: ITuitDao) {
        this.app = app;
        this.tuitDao = tuitDao;
        this.app.get('/api/tuits', this.findAllTuits);
        this.app.get('/api/tuits/:tuitid', this.findTuitById);
        this.app.get('/api/user/:userid/tuits', this.findTuitsByUser);
        this.app.post('/api/tuits', this.createTuit);
        this.app.put('/api/tuits/:tuitid', this.updateTuit);
        this.app.delete('/api/tuits/:tuitid', this.deleteTuit);
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