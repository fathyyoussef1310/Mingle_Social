import { Schema, model, Document } from "mongoose";

export interface IOtp {
    code: string;
    email: string;
    isDone?: boolean;
    expiredAt: Date;
}

export type OtpDocument = Document & IOtp;

const otpSchema = new Schema<IOtp>(
    {
        code: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        isDone: {
            type: Boolean,
            default: false,
        },
        expiredAt: {
            type: Date,
            required: true,
            index: {
                expires: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

export const Otp = model<IOtp>("Otp", otpSchema);
export default Otp;

