import ITuitDao from "../interfaces/ITuitDao";
import Tuit from "../models/Tuit";
import TuitModel from "./TuitModel";

export default class TuitDao implements ITuitDao {
    async findAllTuits(): Promise<Tuit[]> {
        return TuitModel.find();
    }
    async findTuitsByUser(uid: string): Promise<Tuit[]> {
        return TuitModel.find({ postedBy: uid }, { postedBy: 0 }).populate('postedBy').exec();
    }
    async findTuitById(tid: string): Promise<Tuit | null> {
        return TuitModel.findById(tid);
    }
    async createTuit(tuit: Tuit): Promise<Tuit> {
        return TuitModel.create(tuit);
    }
    async updateTuit(tid: string, tuit: Tuit): Promise<any> {
        return TuitModel.updateOne({ _id: tid }, { $set: tuit });
    }
    async deleteTuit(tid: string): Promise<any> {
        return TuitModel.deleteOne({ _id: tid });
    }
}