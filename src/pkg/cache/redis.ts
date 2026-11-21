import Redis from "ioredis";
import { ICacheProvider } from "./cacheInterface";
export class RedisCacheProvider implements ICacheProvider {
    client: Redis;
    constructor(config: { host: string; port: string | number; user?: any; password?: any }) {
        // Initialize the ioredis client with production-ready options
        this.client = new Redis({
            host: config.host,
            port: typeof config.port === "string" ? parseInt(config.port, 10) : config.port,
            password: config.password || undefined,
            lazyConnect: true, // Connect explicitly rather than blocking on instantiation
            maxRetriesPerRequest: 3, // Prevent indefinitely queued commands on connection loss
        });
        this.client.connect().catch((err: Error) => {
            console.error("[RedisCacheProvider] Connection error:", err);
        });
        this.client.on("error", (err: Error) => {
            console.error("[RedisCacheProvider] Runtime error:", err);
        });
    }
    set(key: string, value: string, ttl: number): Promise<string | null> {
        return this.client.set(key, value, "EX", ttl);
    }
    get(key: string): Promise<string | null> {
        return this.client.get(key);
    }
    del(key: string): Promise<number> {
        return this.client.del(key);
    }
}

export default RedisCacheProvider;
