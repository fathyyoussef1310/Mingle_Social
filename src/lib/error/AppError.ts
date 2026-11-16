export class AppError extends Error {
    public  isOperational?: boolean;
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "AppError";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}