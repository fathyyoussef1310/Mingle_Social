/**
 * FILE TYPE VALIDATION MIDDLEWARE (MAGIC NUMBER VERIFICATION)
 *
 * Responsibility:
 * Validates uploaded files by inspecting their underlying binary header ("magic bytes"),
 * rather than trusting user-supplied file extensions or MIME headers.
 *
 * How Magic Number Validation Works:
 * Every legitimate file format starts with specific signature bytes (magic numbers):
 * - JPEG always starts with bytes `FF D8 FF`.
 * - PNG always starts with bytes `89 50 4E 47 0D 0A 1A 0A`.
 * - PDF starts with `%PDF`.
 * This middleware reads the actual file buffer and inspects the binary signature using `file-type`.
 * If the binary signature does not match the list of allowed MIME types, the upload is rejected
 * with an `AppError(400 Bad Request)`.
 * Architecture:
 * Middleware / Security Layer.
 
 * Used by:
 * - Profile avatar upload routes, post media attachments, and image processing endpoints.
 *
 * Application Flow:
 * Client uploads multipart form data (Multer) -> file saved to temp disk ->
 * fileValidation middleware inspects magic bytes -> If valid: next() -> Controller processes upload.
 */
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../lib/error/AppError";

export const fileValidation = (allowedTypes: string[] = ["image/png", "image/jpeg"]) => {
    return async (
        req: Request & { file?: { path: string } },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.file) {
                next(new AppError("No file uploaded", 400));
                return;
            }
            const filePath = req.file.path;
            const buffer = fs.readFileSync(filePath);
            let mime: string | undefined;
            try {
                const fileTypeModule = await (Function('return import("file-type")')() as Promise<{
                    fileTypeFromBuffer: (buf: Uint8Array) => Promise<{ mime: string } | undefined>;
                }>);
                const result = await fileTypeModule.fileTypeFromBuffer(buffer);
                mime = result?.mime;
            } catch (e) {
                next(new AppError("file type not supported", 400));
                return;
            }
 if (!mime || !allowedTypes.includes(mime)) {
                next(new AppError("Invalid file type", 400));
                return;
            }
            next();
        } catch (error) {
            console.error("File validation error:", error);
            next(new AppError("Internal server error", 500));
        }
    };
};

export default fileValidation;
