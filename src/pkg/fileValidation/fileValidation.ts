import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../lib/error/AppError";


export const fileValidation = (allowedTypes: string[] = ["image/png", "image/jpeg"]) => {
    return async (req: Request & { file?: { path: string } }, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                next(new AppError("No file uploaded", 400));
                return;
            }
            const filePath = req.file.path;
            const buffer = fs.readFileSync(filePath);
            let mime: string | undefined;
            try {
                // Try dynamic import of file-type if available
                const fileTypeModule = await (Function('return import("file-type")')() as Promise<{
                    fileTypeFromBuffer: (buf: Uint8Array) => Promise<{ mime: string } | undefined>;
                }>);
                const result = await fileTypeModule.fileTypeFromBuffer(buffer);
                mime = result?.mime;
            } catch (e){
                next(new AppError("file type not supported",400 ))
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
