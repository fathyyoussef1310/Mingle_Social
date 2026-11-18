import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
export function globalErrorHandler(err: AppError, req: Request, res: Response, _next: NextFunction) {
    const statusCode = err.statusCode || 500;
    if (err.isOperational) {
        res.status(statusCode).json({
            status: "error",
            statusCode,
            success: false,
            message: err.message,
        });
        return;
    }
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        status: "error",
        statusCode,
        success: false,
        message,
    });
}