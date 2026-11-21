/**
 * CUSTOM OPERATIONAL ERROR CLASS
 *
 * Responsibility:
 * Represents known, predictable operational errors (client mistakes, validation failures,
 * authentication rejections) with an associated HTTP status code.
 *
 * Why does this file exist?
 * JavaScript's built-in `Error` class only carries a `message` string and a stack trace.
 * It has no concept of HTTP response codes (`statusCode`) or whether an error represents
 * a deliberate business rejection vs an unexpected software crash. `AppError` subclasses `Error`
 * to bridge application business logic with HTTP transport status codes.
 *
 * Architecture:
 * Core Infrastructure / Error Handling.
 *
 * Dependencies:
 * - Native JavaScript `Error`.
 *
 * Used by:
 * - `src/app/auth/service/auth.service.ts`: To throw 400, 401, 403, 404, 409, 429 errors.
 * - `src/lib/validation/validation.ts`: To throw 400 validation errors.
 * - `src/lib/error/errorhandler.ts`: To identify operational errors and format clean JSON responses.
 *
 * Application Flow:
 * Service throws `new AppError("Email already exists", 409)` ->
 * Controller catches and calls `next(err)` ->
 * `errorhandler.ts` inspects `isOperational` -> Sends `{ statusCode: 409, message: ... }`
 */

export class AppError extends Error {
    /**
     * Flag indicating whether this error is an operational, handled business error.
     * When true, the error message is safe to send back to external clients.
     */
    public isOperational?: boolean;

    /**
     * Constructs a new AppError.
     *
     * @param message - Human-readable explanation of why the operation failed.
     * @param statusCode - HTTP status code to return to the client (e.g. 400, 401, 404, 409, 429).
     */
    constructor(message: string, public statusCode: number) {
        // Pass the error message to the V8 Error base class
        super(message);

        // Explicitly set the name property to match the class name
        this.name = "AppError";

        // Mark as an operational error
        this.isOperational = true;

        // Capture clean V8 stack trace excluding this constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}
