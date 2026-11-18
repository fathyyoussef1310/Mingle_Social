import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";

export function correlationId(req: Request, res: Response, next: NextFunction): void {
    const id = crypto.randomUUID();
    req.correlationId = id;
    res.setHeader("X-Correlation-ID", id);
    next();
}

export default correlationId;

