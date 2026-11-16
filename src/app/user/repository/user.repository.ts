import {IUser} from "../../../lib/interface/UserInterface";
import {User} from "../../../lib/models/user.model";
import {ObjectId} from "mongodb";
import {Types} from "mongoose";
import { AbstractRepository } from "../../abstract";

class UserRepository extends AbstractRepository<IUser>{
    constructor() {
        super(User);
    }

}
export default new UserRepository();