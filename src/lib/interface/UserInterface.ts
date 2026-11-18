import { Gender, Provider } from "../enum/enum";
import { Types } from "mongoose";

export interface IUser {
    _id?: Types.ObjectId;
    id?: string;
    userName: string;
    email: string;
    password?: string;
    provider?: Provider;
    gender?: Gender;
    phoneNumber?: string;
    isVerified?: boolean;
    isDeleted?: boolean;
    twoStepVerification?: boolean;
    role?: string;
}
