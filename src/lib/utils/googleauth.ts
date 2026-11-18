import { OAuth2Client, TokenPayload } from "google-auth-library";
import { AppError } from "../error/AppError";
import { config } from "../config/env";

const client = new OAuth2Client();

export const verifyGoogleToken = async (token: string): Promise<TokenPayload> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.google.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new AppError("Invalid Verification Token", 401);
        }
        return payload;
    } catch (e: any) {
        if (e instanceof AppError) {
            throw e;
        }
        throw new AppError("Invalid Verification Token", 401);
    }
};
