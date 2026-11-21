import { HydratedDocument, model, Schema } from "mongoose";

// Import Enums for allowed Genders and Providers (Local vs Google)
import { Gender, Provider } from "../enum/enum";
import { IUser } from "../interface/UserInterface";

export type userDocument = HydratedDocument<IUser>;

const schema = new Schema<IUser>(
    {
        // Display username (trimmed of leading/trailing whitespace)
        userName: {
            type: String,
            required: true,
            trim: true,
        },

        // Unique email address used for login and notifications
        email: {
            type: String,
            required: true,
            maxLength: 100,
            minLength: 5,
            trim: true,
            toLowerCase: true,
            unique: true, // Creates a unique MongoDB B-Tree index
        },
        password: {
            type: String,
            required: function (this: IUser): boolean {
                return this.provider === Provider.LOCAL || !this.provider;
            },
            maxLength: 100,
            minLength: 6,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        provider: {
            type: Number,
            default: Provider.LOCAL,
            enum: Provider,
        },

        gender: {
            type: String,
            enum: Gender,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        twoStepVerification: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

export const User = model<IUser>("User", schema);
export default User;
