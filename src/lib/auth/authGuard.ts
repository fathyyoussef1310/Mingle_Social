import jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express";
import {AppError} from "../error/AppError";
import {config} from "../config/env";

interface JwtPayload{
    sub:string,
    email:string,
    role:string,
}
//  * Express Middleware: `authGuard`
//  * Extracts the access token from cookies (or the Authorization header),
//  * validates the cryptographic signature using the server secret,
//  * attaches the decoded payload to `req.user`, and passes control to the next handler.
//  */
function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const token = (req as any).cookies?.access_token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new AppError("Access token is missing", 401);
        }
        req.user = jwt.verify(token, config.jwt.secret) as JwtPayload;
        next();
    } catch (error) {
        next(error);
    }
}

export default authGuard;
