import { User, userDocument } from "../../../lib/models/user.model";
import { AbstractRepository } from "../../abstract";
import { IUser } from "../../../lib/interface/UserInterface";
import { Types } from "mongoose";

export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<userDocument | null> {
        return User.findOne({ email });
    }

    async checkUserByEmail(email: string): Promise<userDocument | null> {
        return User.findOne({ email }).select("+password");
    }

    async updateUserByEmail(email: string, updateData: any): Promise<userDocument | null> {
        return User.findOneAndUpdate({ email }, updateData, { new: true });
    }

    async findUserById(id: string | Types.ObjectId): Promise<userDocument | null> {
        return User.findById(id);
    }

    async findVerifiedUsers(): Promise<userDocument[]> {
        return User.find({ isVerified: true });
    }
}

export const userRepository = new UserRepository();
export default userRepository;
