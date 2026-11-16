
import { Request, Response, NextFunction } from "express";
import AuthService from "../service/auth.service";

class AuthController {
    constructor(private readonly authService = AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.login(req.body);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.verifyAccount(req.body);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.forgetPassword(req.body);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.sendOtp(req.body);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };
}

const authController = new AuthController();

export default authController;
