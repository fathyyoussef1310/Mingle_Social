import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthServices, authService as defaultAuthService } from "../service/auth.service";

export class AuthController {
    constructor(private readonly authService: AuthServices = defaultAuthService) {}

    register: RequestHandler = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({
                message: "Successfully created user",
                user,
            });
        } catch (error) {
            next(error);
        }
    };

    login: RequestHandler = async (req, res, next) => {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json({
                message: "Successfully logged in",
                ...result,
            });
        } catch (error) {
            next(error);
        }
    };

    verifyAccount: RequestHandler = async (req, res, next) => {
        try {
            const user = await this.authService.verifyAccount(req.body);
            res.status(200).json({
                message: "Account verified successfully",
                user,
            });
        } catch (error) {
            next(error);
        }
    };

    forgetPassword: RequestHandler = async (req, res, next) => {
        try {
            const user = await this.authService.forgetPassword(req.body);
            res.status(200).json({
                message: "Password reset successfully",
                user,
            });
        } catch (error) {
            next(error);
        }
    };

    sendOtp: RequestHandler = async (req, res, next) => {
        try {
            const result = await this.authService.sendOtp(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    loginWithGoogle: RequestHandler = async (req, res, next) => {
        try {
            const result = await this.authService.loginWithGoogle(req.body.idToken);
            res.status(200).json({
                message: "Successfully logged in with Google",
                ...result,
            });
        } catch (error) {
            next(error);
        }
    };

    refreshSession: RequestHandler = async (req, res, next) => {
        try {
            const result = await this.authService.refreshSession(req.body.refreshToken);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    twoStepVerification: RequestHandler = async (req, res, next) => {
        try {
            const { email, code } = req.body;
            const user = await this.authService.enable2Verification(email, code);
            res.status(200).json({
                message: "Two-step verification enabled successfully",
                user,
            });
        } catch (error) {
            next(error);
        }
    };

    verify2StepLogin: RequestHandler = async (req, res, next) => {
        try {
            const { email, code } = req.body;
            const result = await this.authService.verifyAfter2StepVer(email, code);
            res.status(200).json({
                message: "Two-step verification login successful",
                ...result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const authController = new AuthController();
export default authController;
