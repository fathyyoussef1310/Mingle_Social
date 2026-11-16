import jwt  from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {AppError} from "../error/AppError";
import {config} from "../config/env";

interface  JwtPayload  {
    sub:string ,
    email:string ,
    role:string
}
function authGuard(req: Request, res: Response, next: NextFunction) {
 try{
    const token = req.cookies.access_token;
    if (!token) {
        throw new AppError("Access token is missing", 401);
    }
     req.user = jwt.verify(token, config.jwt.secret) as JwtPayload;
    next();

 }catch (error) {
    next(error)
 }
}

export default authGuard