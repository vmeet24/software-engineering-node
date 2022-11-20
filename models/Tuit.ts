/**
 * @file Model class for Tuit
 */

import Stats from "./Stats";
import User from "./User";

export default interface Tuit {
    tuit: string;
    postedOn: Date;
    postedBy: User;
    stats: Stats;
}