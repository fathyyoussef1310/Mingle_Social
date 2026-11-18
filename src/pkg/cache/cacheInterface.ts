export interface ICacheProvider {
    set(key: string, value: string, ttl: number): Promise<string | null>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
}
