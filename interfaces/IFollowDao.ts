import Follow from "../models/Follow";

export default interface IFollowDao {
    findAllUsersThatUserIsFollowing(uid: string): Promise<Follow[]>;
    findAllUsersThatUserIsFollowedBy(uid: string): Promise<Follow[]>;
    userFollowsAnotherUser(source_uid: string, target_uid: string): Promise<Follow>;
    userUnFollowsAnotherUser(source_uid: string, target_uid: string): Promise<any>;
};