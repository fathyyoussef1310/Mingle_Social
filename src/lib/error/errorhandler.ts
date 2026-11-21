/**
 * GLOBAL EXPRESS ERROR-HANDLING MIDDLEWARE
 *
 * Responsibility:
 * The terminal error-catching middleware in the Express application pipeline.
 * Catches all errors passed via `next(err)` and formats them into a standardized JSON response.
 *
 * Why does this file exist?
 * In Express, if an unhandled error is thrown or passed via `next(err)`, Express's default HTML
 * error page is returned (which leaks stack traces and database internal paths to clients).
 * This middleware intercepts all errors, ensuring the client always receives a clean JSON payload
 * and that internal implementation details are hidden on unexpected 500 errors.
 *
 * Architecture:
 * Presentation Layer / Global Error Middleware.
 *
 * Dependencies:
 * - `express`: Provides `Request`, `Response`, and `NextFunction` types.
 * - `./AppError`: Identifies operational errors carrying custom HTTP status codes.
 *
 * Used by:
 * - Mounted at the very bottom of the middleware stack in `src/app.ts`.
 *
 * Express Convention:
 * Express identifies error middleware specifically by the presence of **4 arguments**:
 * `(err, req, res, next)`. If you remove any argument, Express will mistake it for standard middleware!
 */

// Import Express middleware types
import { Request, Response, NextFunction } from "express";

// Import custom operational error class
import { AppError } from "./AppError";

/**
 * Global Error Handler Function
 *
 * Inspects whether an error was deliberately thrown by business logic (`err.isOperational`)
 * or caused by an unexpected software bug, formatting the appropriate JSON response.
 */
export function globalErrorHandler(
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    // Default to 500 Internal Server Error if no specific HTTP code was attached
    const statusCode = err.statusCode || 500;

    // Operational, trusted error: Safe to expose message directly to the client
    if (err.isOperational) {
        res.status(statusCode).json({
            status: "error",
            statusCode,
            success: false,
            message: err.message,
        });
        return;
    }

    // Programmer / Unknown Bug: Hide internal error details to prevent security leaks
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        status: "error",
        statusCode,
        success: false,
        message,
    });
}
