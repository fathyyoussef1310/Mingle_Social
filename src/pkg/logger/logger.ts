/**
 * STRUCTURED JSON LOGGER (OBSERVABILITY & LOGGING)
 *
 * Responsibility:
 * Emits structured, machine-readable JSON log events with timestamps, log levels, and metadata.
 *
 * Why does this file exist?
 * In production cloud environments (AWS CloudWatch, Datadog, ELK Stack, Grafana Loki),
 * plain text console strings (`console.log("Error happened")`) are difficult to query, filter,
 * or alert on.
 * By emitting logs in structured JSON:
 * `{"level":"error","msg":"Login failed","email":"user@test.com","timestamp":1700000000}`
 * log collectors can automatically index every field, allowing developers to filter by level,
 * status code, user ID, or correlation ID.
 *
 * Special Features in this Implementation:
 * 1. **Error Serialization (`serialize`)**:
 *    In JavaScript, standard `JSON.stringify(new Error("msg"))` results in an empty object `{}`!
 *    Our `serialize` function explicitly extracts `name`, `message`, `statusCode`, `stack`, and `details`.
 * 2. **Circular Reference Protection (`safeStringify`)**:
 *    Complex objects (like Express `req` or Mongoose documents) often contain circular references.
 *    Calling `JSON.stringify` directly throws `TypeError: Converting circular structure to JSON`.
 *    Using a `WeakSet` detector, circular references are safely replaced with `"[Circular]"` strings.
 * 3. **Singleton Pattern**:
 *    The `Logger` class enforces a single shared instance throughout the entire application lifecycle.
 *
 * Architecture:
 * Infrastructure / Logging Layer.
 *
 * Dependencies:
 * None (pure TypeScript / Node.js standard library).
 *
 * Used by:
 * - `src/app.ts`: Global application logging.
 * - `src/lib/error/errorhandler.ts`: Logs unhandled exceptions and HTTP errors.
 * - Entire application for structured debug, info, warn, and error messages.
 */

/**
 * Union type defining standard syslog-compatible severity levels.
 */
export type LogLevel = "info" | "error" | "warn" | "debug";

/**
 * Safely serializes arbitrary metadata values into a key-value object.
 *
 * Specially handles:
 * - `Error` instances: Extracts non-enumerable properties like message, stack, and status codes.
 * - Objects: Passed through directly.
 * - Primitives (strings, numbers): Wrapped in `{ data: value }`.
 *
 * @param value - Unknown metadata passed into the logger.
 * @returns A plain JavaScript object suitable for JSON serialization.
 */
const serialize = (value: unknown): Record<string, unknown> => {
    if (value instanceof Error) {
        const err = value as any;
        return {
            name: err.name,
            message: err.message,
            statusCode: err.statusCode ?? err.response?.status,
            details: err.response?.data ?? err.ErrorMessage,
            stack: err.stack,
        };
    }
    if (value !== null && typeof value === "object") {
        return value as Record<string, unknown>;
    }
    return { data: value };
};

/**
 * Serializes an object to a JSON string without crashing on circular references.
 *
 * Uses a `WeakSet` to track visited objects during recursion.
 * If an object has already been encountered, returns `"[Circular]"` instead of throwing an exception.
 *
 * @param obj - The object to stringify.
 * @returns A valid JSON formatted string.
 */
const safeStringify = (obj: unknown): string => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, val) => {
        if (typeof val === "object" && val !== null) {
            if (seen.has(val)) return "[Circular]";
            seen.add(val);
        }
        return val;
    });
};

/**
 * Singleton Logger class providing standardized logging methods.
 */
export class Logger {
    /** Static reference holding the single created Logger instance */
    private static instance: Logger;

    /**
     * Enforces the Singleton pattern: returns the existing instance if one already exists.
     */
    constructor() {
        if (!Logger.instance) {
            Logger.instance = this;
        }
        return Logger.instance;
    }

    /**
     * Core logging function formatting and emitting the structured JSON log entry to stdout.
     *
     * @param msg - Human-readable description of the log event.
     * @param level - Severity level ("info", "error", "warn", "debug").
     * @param metaData - Optional object, Error, or value providing contextual details.
     */
    public log(msg: string, level: LogLevel | string = "info", metaData?: unknown): void {
        const messageObj = {
            level,
            msg,
            ...serialize(metaData),
            timestamp: Date.now(),
        };

        // Output to standard output (captured by Docker/Kubernetes/CloudWatch)
        console.log(safeStringify(messageObj));
    }

    /**
     * Emits an ERROR-level log entry.
     *
     * @param msg - Error description.
     * @param metaData - Error object or context.
     */
    public error(msg: string, metaData?: unknown): void {
        this.log(msg, "error", metaData);
    }

    /**
     * Emits an INFO-level log entry for general operational notices.
     *
     * @param msg - Informational message.
     * @param metaData - Contextual parameters.
     */
    public info(msg: string, metaData?: unknown): void {
        this.log(msg, "info", metaData);
    }

    /**
     * Emits a WARN-level log entry for recoverable issues or warnings.
     *
     * @param msg - Warning message.
     * @param metaData - Contextual parameters.
     */
    public warn(msg: string, metaData?: unknown): void {
        this.log(msg, "warn", metaData);
    }

    /**
     * Emits a DEBUG-level log entry used during development and diagnostics.
     *
     * @param msg - Diagnostic message.
     * @param metaData - Diagnostic parameters.
     */
    public debug(msg: string, metaData?: unknown): void {
        this.log(msg, "debug", metaData);
    }
}

/** Exported global singleton logger instance */
export const logger = new Logger();
export default logger;
