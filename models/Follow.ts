import User from "./User";

export default interface Follow {
    userFollowing: User;
    userFollowed: User;
}