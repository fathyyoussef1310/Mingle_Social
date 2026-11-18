import jwt, { JwtPayload } from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import { config } from "../../../lib/config/env";
import {IUser} from "../../../lib/interface/UserInterface";

export const signAccess = (user: IUser): string =>
    jwt.sign(
        { sub: user.id || user._id, role: user.role || "user", email: user.email },
        config.jwt.accessSecret,
        {
            expiresIn: config.jwt.expiresIn as any,
        }
    );

export const signRefresh = (user: any, family: string): string =>
    jwt.sign(
        { sub: user.id || user._id, family },
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
