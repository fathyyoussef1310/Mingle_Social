import { HydratedDocument, model, Schema } from "mongoose";
import { Gender, Provider } from "../enum/enum";
import { IUser } from "../interface/UserInterface";

export type userDocument = HydratedDocument<IUser>;

const schema = new Schema<IUser>(
    {
        userName: { type: String, required: true, trim: true },
        email: { type: String, required: true, maxLength: 100, minLength: 5, trim: true, toLowerCase: true, unique: true },
        password: {
            type: String,
            required: function (this: IUser): boolean {
                return this.provider === Provider.LOCAL || !this.provider;
            },
            maxLength: 100,
            minLength: 6,
            trim: true,
        },
        phoneNumber: { type: String, trim: true },
        provider: { type: Number, default: Provider.LOCAL, enum: Provider },
        gender: { type: String, enum: Gender },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        twoStepVerification: { type: Boolean, default: false },
        role: { type: String, default: "user" },
    },
    {
        timestamps: true,
    }
);

export const User = model<IUser>("User", schema);
export default User;
