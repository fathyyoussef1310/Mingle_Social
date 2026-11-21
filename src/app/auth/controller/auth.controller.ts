/**
 * AUTHENTICATION CONTROLLER
 *
 * Responsibility:
 * Handles incoming HTTP requests for all authentication workflows (user registration, login,
 * email OTP verification, password reset, Google OAuth, session refresh, and two-factor authentication).
 *
 * Why does this file exist?
 * To separate HTTP transport concerns (parsing request bodies, reading headers, setting status codes,
 * and serializing JSON responses) from the core business logic. This follows the Single Responsibility
 * Principle (SRP) and ensures that `AuthServices` remains pure, independent of Express, and easily testable.
 *
 * Architecture:
 * Presentation Layer / HTTP Controller.
 *
 * Dependencies:
 * - `express`: Provides HTTP handler types (`Request`, `Response`, `NextFunction`, `RequestHandler`).
 * - `../service/auth.service`: The domain service containing business rules for authentication.
 *
 * Used by:
 * - `src/app/auth/router/route.ts`: Mounts these controller methods as Express route handlers.
 *
 * Application Flow:
 * Client Request -> Router (`route.ts`) -> Controller (`auth.controller.ts`) -> Service (`auth.service.ts`) -> Client Response
 */

// Import Express types used to strongly type request handler functions
import { Request, Response, NextFunction, RequestHandler } from "express";

// Import the AuthServices class and its default singleton instance
import { AuthServices, authService as defaultAuthService } from "../service/auth.service";

/**
 * AuthController Class
 *
 * Manages the boundary between client HTTP requests and the authentication service.
 * Each method is bound as an arrow function property typed with Express's `RequestHandler`
 * to maintain the correct lexical `this` context when invoked by the Express router.
 */
export class AuthController {
    /**
     * Constructor with Dependency Injection
     *
     * @param authService - The authentication business logic service.
     * Defaults to the live singleton `defaultAuthService`, but allows passing a mock service
     * in automated unit tests.
     */
    constructor(private readonly authService: AuthServices = defaultAuthService) {}

    /**
     * User Registration Handler
     *
     * Endpoint: POST /api/auth/register
     *
     * Workflow:
     * 1. Extracts user registration payload (`userName`, `email`, `password`) from `req.body`.
     * 2. Delegates user creation, password hashing, and OTP generation to `this.authService.register`.
     * 3. Responds with HTTP 201 Created and the sanitized public user profile.
     * 4. Catches any errors (such as duplicate email) and forwards them to the global error middleware via `next(error)`.
     */
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

    /**
     * User Login Handler
     *
     * Endpoint: POST /api/auth/login
     *
     * Workflow:
     * 1. Extracts login credentials (`email`, `password`) from `req.body`.
     * 2. Calls `this.authService.login` to verify credentials against brute-force rules and database.
     * 3. If 2FA is required, responds with 200 OK and `{ requires2FA: true, message: "OTP sent" }`.
     * 4. If standard login succeeds, responds with 200 OK containing JWT tokens and sanitized user.
     * 5. Catches authentication failures (e.g. invalid password, account banned) and delegates to `next(error)`.
     */
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

    /**
     * Account Verification Handler
     *
     * Endpoint: POST /api/auth/verify-account
     *
     * Workflow:
     * 1. Extracts email and verification OTP code (`code` or `otp`) from `req.body`.
     * 2. Calls `this.authService.verifyAccount` to validate the OTP and activate the account.
     * 3. Responds with HTTP 200 OK and the verified user profile.
     */
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

    /**
     * Forgot / Reset Password Handler
     *
     * Endpoint: POST /api/auth/forget-password
     *
     * Workflow:
     * 1. Extracts `email`, verification `code`, and `newPassword` from `req.body`.
     * 2. Validates OTP and updates the password hash in the database.
     * 3. Revokes all active refresh token sessions for security.
     * 4. Responds with HTTP 200 OK on success.
     */
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

    /**
     * Resend / Send OTP Handler
     *
     * Endpoint: POST /api/auth/send-otp
     *
     * Workflow:
     * 1. Extracts user `email` from `req.body`.
     * 2. Verifies the user exists, generates a fresh 6-digit OTP, and emails it.
     * 3. Responds with HTTP 200 OK and a confirmation message.
     */
    sendOtp: RequestHandler = async (req, res, next) => {
        try {
            const result = await this.authService.sendOtp(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Google OAuth2 Login Handler
     *
     * Endpoint: POST /api/auth/login-with-google
     *
     * Workflow:
     * 1. Extracts Google `idToken` from `req.body`.
     * 2. Verifies token integrity via Google's OAuth2 SDK.
     * 3. Finds or automatically creates the user record.
     * 4. Issues standard application JWT access and refresh token pairs.
     */
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

    /**
     * Refresh Token Session Handler
     *
     * Endpoint: POST /api/auth/refresh-token
     *
     * Workflow:
     * 1. Extracts `refreshToken` from `req.body`.
     * 2. Cryptographically verifies token signature and checks database for theft/replay.
     * 3. Performs Refresh Token Rotation: invalidates the old token and issues a new token pair.
     * 4. Responds with HTTP 200 OK containing the new access and refresh tokens.
     */
    refreshSession: RequestHandler = async (req, res, next) => {
        try {
            const result = await this.authService.refreshSession(req.body.refreshToken);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Enable Two-Step Verification Handler
     *
     * Endpoint: PATCH /api/auth/two-step-verification
     *
     * Workflow:
     * 1. Extracts `email` and `code` from `req.body`.
     * 2. Validates OTP and updates user document setting `twoStepVerification: true`.
     * 3. Responds with HTTP 200 OK confirming 2FA activation.
     */
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

    /**
     * Verify 2FA Code to Complete Login Handler
     *
     * Endpoint: POST /api/auth/two-step-verification-login
     *
     * Workflow:
     * 1. Extracts `email` and 2FA `code` from `req.body`.
     * 2. Validates OTP and issues session access and refresh tokens.
     * 3. Responds with HTTP 200 OK and session tokens.
     */
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

// Export a default singleton instance for direct use in route declarations
export const authController = new AuthController();
export default authController;
