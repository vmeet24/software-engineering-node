import IUserDao from "../interfaces/IUserDao";
import User from "../models/User";
import UserModel from "./UserModel";

export default class UserDao implements IUserDao {

    async findAllUsers(): Promise<User[]> {
        return UserModel.find();
    }
    async findUserById(uid: string): Promise<User | null> {
        return UserModel.findById(uid);
    }
    async createUser(user: User): Promise<User> {
        return UserModel.create(user);
    }
    async updateUser(uid: string, user: User): Promise<any> {
        return UserModel.updateOne({ _id: uid }, { $set: user });
    }
    async deleteUser(uid: string): Promise<any> {
        return UserModel.deleteOne({ _id: uid });
    }
}