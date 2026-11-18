// utils/generateToken.js
import jwt, {JwtPayload} from "jsonwebtoken";
import {config} from "../config/env";
import {IUser} from "../interface/UserInterface";

export const generateToken = (payload:JwtPayload & Partial<IUser>) => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: "1h" });
};