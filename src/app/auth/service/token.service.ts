/**

 * Responsibility:
 * Encapsulates all cryptographic token operations, including signing access and refresh JWTs,
 * verifying token signatures, and computing SHA-256 hashes of refresh tokens.
 *
 * Why does this file exist?
 * To separate cryptographic token mechanics (secrets, expiry durations, algorithms, payload signing)
 * from general authentication logic in `AuthServices`. This satisfies the Single Responsibility Principle
 * and ensures that if token signing algorithms or secrets ever change, only this file is modified.


 * Used by:
 * - `src/app/auth/service/auth.service.ts`: Used when issuing token pairs or refreshing sessions.
 * - `src/lib/auth/authGuard.ts`: Used when verifying access tokens on protected routes.
 *
 * Application Flow:
 * AuthService -> TokenService.signAccess() -> Returns signed JWT string -> Sent to Client
 */
import jwt, { JwtPayload } from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import { config } from "../../../lib/config/env";
import { IUser } from "../../../lib/interface/UserInterface";

export const signAccess = (user: IUser | any): string =>
    jwt.sign({ sub: user.id || user._id, role: user.role || "user", email: user.email },
        config.jwt.accessSecret,
        {
            expiresIn: config.jwt.expiresIn as any,
        }
    );

export const signRefresh = (user: any, family: string): string =>
    jwt.sign({ sub: user.id || user._id, family },
        config.jwt.refreshSecret,
        {
            expiresIn: config.jwt.refreshExpiresIn as any,
            jwtid: randomUUID(),
        }
    );
export const verifyAccess = (token: string): JwtPayload | string =>
    jwt.verify(token, config.jwt.accessSecret);

export const verifyRefresh = (token: string): any =>
    jwt.verify(token, config.jwt.refreshSecret);

export const hash = (token: string): string =>
    createHash("sha256").update(token).digest("hex");

export class TokenService {
    signAccess = signAccess;
    signRefresh = signRefresh;
    verifyAccess = verifyAccess;
    verifyRefresh = verifyRefresh;
    hash = hash;
}
export const tokenService = new TokenService();
export default tokenService;
