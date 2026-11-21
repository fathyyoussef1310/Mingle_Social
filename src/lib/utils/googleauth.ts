/**

 * Why does this file exist?
 * In modern web and mobile apps, Google Sign-In happens on the client (browser or mobile app).
 * The client receives an OpenID Connect `idToken` from Google and sends it to our backend.
 * Our backend MUST verify that:
 * 1. The token was actually signed by Google (using Google's public cryptographic keys).
 * 2. The token is not expired.
 * 3. The `audience` matches our Google OAuth Client ID (so an attacker cannot take a token issued
 *    for another application and present it to our API).
 *
 * How it works:
 * The `OAuth2Client` from `google-auth-library` fetches Google's public certificates, verifies the
 * signature, and returns the decoded `TokenPayload` containing verified profile information
 * (`email`, `name`, `sub`, `email_verified`, `picture`).
 *
 * Architecture:
 * Utilities / External Auth Provider Layer.

 * Used by:
 * - `src/app/auth/service/auth.service.ts`: Verifies incoming tokens during Google Login/Registration (`loginWithGoogle`).
 */
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

export default verifyGoogleToken;
