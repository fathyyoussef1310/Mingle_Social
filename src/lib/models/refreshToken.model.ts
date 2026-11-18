import { Schema, model, Document, Types } from "mongoose";

export interface IRefreshToken {
    user: Types.ObjectId | string;
    tokenHash: string;
    family: string;
    expiresAt: Date;
    revokedAt?: Date | null;
}

export type RefreshTokenDocument = Document & IRefreshToken;

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        tokenHash: { type: String, required: true, unique: true },
        family: { type: String, required: true, index: true },
        expiresAt: { type: Date, required: true },
        revokedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
export default RefreshToken;

