import { IUser } from "./UserInterface";
import { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload extends Partial<IUser>, JwtPayload {
    sub?: string;
    email?: string;
    role?: string;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthUserPayload;
        correlationId?: string;
    }
}
