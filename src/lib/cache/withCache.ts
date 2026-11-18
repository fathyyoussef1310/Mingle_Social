import { cacheProvider } from "./init";
import { NextFunction, Request, Response } from "express";

export function withCache(ttl = 3600) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let key = `${req.method}:${req.originalUrl}`;
            const cached = await cacheProvider.get(key);
            if (cached) {
                res.setHeader("X-Cache", "HIT");
                return res.status(200).json(JSON.parse(cached));
            }

            const originalJson = res.json.bind(res);
            //// Interceptor
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    res.setHeader("X-Cache", "MISS");
                    cacheProvider.set(key, JSON.stringify(body), ttl)
                        .catch((err) => {
                            console.error("Cache error:", err);
                        });
                }
                return originalJson(body);
            };
            next();

        } catch (err) {
            next(err);
        }
    };
}
