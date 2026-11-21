/**
 * Used by:
 * - `src/app/auth/service/auth.service.ts`: For OTP storage and rate limiting.
 * - `src/lib/cache/withCache.ts`: For HTTP route response caching.
 *
 * Application Flow:
 * Application starts -> `init.ts` connects to Redis server -> `cacheProvider` exported for use.
 */
import { RedisCacheProvider } from "../../pkg/cache/redis";
import { config } from "../config/env";
export const cacheProvider = new RedisCacheProvider({
    host: config.redis.host as string,
    port: config.redis.port as string,
    user: config.redis.user,
    password: config.redis.password,
});
