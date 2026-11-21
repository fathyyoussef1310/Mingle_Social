/**
 * TIME UNIT CONVERSION UTILITIES
 *
 * Responsibility:
 * Provides conversion helpers to transform various time durations into milliseconds or seconds.
 *
 * Why does this file exist?
 * In backend systems, different subsystems expect time expressed in different units:
 * - Redis TTLs expect time in **seconds** (`"EX", ttl`).
 * - Node.js `setTimeout` and Cookie `maxAge` expect time in **milliseconds**.
 * - JWT expiration strings can take human formats (`"1h"`, `"7d"`).
 * Manually calculating `time * 60 * 1000` or `time * 60 * 60 * 24` scattered throughout the codebase
 * is error-prone and leads to "magic numbers".
 * These utility functions provide clear, readable conversions with strong TypeScript unit checking.
 *
 * Architecture:
 * Utilities Layer.
 *
 * Dependencies:
 * None (pure TypeScript).
 *
 * Used by:
 * - Cache providers, cookie setters, token expiry helpers, and rate-limiting configurations.
 */

/**
 * Union type of supported time units.
 */
export type TimeUnit = "seconds" | "minutes" | "hours" | "days";

/**
 * Converts a given time quantity and unit into milliseconds.
 *
 * @param time - The numerical value of time units.
 * @param unit - The unit of measurement ("seconds", "minutes", "hours", "days").
 * @returns The equivalent duration in milliseconds.
 *
 * @example
 * toMins(5, "minutes"); // 300,000 ms
 * toMins(1, "hours");   // 3,600,000 ms
 */
export function toMins(time: number, unit: TimeUnit): number {
    switch (unit) {
        case "seconds":
            return time * 1000;
        case "minutes":
            return time * 60 * 1000;
        case "hours":
            return time * 60 * 60 * 1000;
        case "days":
            return time * 60 * 60 * 1000 * 24;
        default:
            return time;
    }
}

/**
 * Converts a given time quantity and unit into seconds.
 *
 * Especially useful for Redis cache TTL parameters (`SET key value EX seconds`).
 *
 * @param time - The numerical value of time units.
 * @param unit - The unit of measurement ("seconds", "minutes", "hours", "days").
 * @returns The equivalent duration in seconds.
 *
 * @example
 * toSeconds(15, "minutes"); // 900 seconds
 * toSeconds(1, "days");     // 86,400 seconds
 */
export function toSeconds(time: number, unit: TimeUnit): number {
    switch (unit) {
        case "seconds":
            return time;
        case "minutes":
            return time * 60;
        case "hours":
            return time * 60 * 60;
        case "days":
            return time * 60 * 60 * 24;
        default:
            return time;
    }
}

export default {
    toMins,
    toSeconds,
};
