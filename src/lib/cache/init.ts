import { RedisCacheProvider } from "../../pkg/cache/redis";
import { config } from "../config/env";

export const cacheProvider = new RedisCacheProvider({
    host: config.redis.host as string,
    port: config.redis.port as string,
    user: config.redis.user,
    password: config.redis.password,
});