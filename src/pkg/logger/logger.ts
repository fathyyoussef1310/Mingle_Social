export type LogLevel = "info" | "error" | "warn" | "debug";

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

// Never throws on circular references
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

export class Logger {
    private static instance: Logger;

    constructor() {
        if (!Logger.instance) {
            Logger.instance = this;
        }
        return Logger.instance;
    }

    public log(msg: string, level: LogLevel | string = "info", metaData?: unknown): void {
        const messageObj = {
            level,
            msg,
            ...serialize(metaData),
            timestamp: Date.now(),
        };

        console.log(safeStringify(messageObj));
    }

    public error(msg: string, metaData?: unknown): void {
        this.log(msg, "error", metaData);
    }

    public info(msg: string, metaData?: unknown): void {
        this.log(msg, "info", metaData);
    }

    public warn(msg: string, metaData?: unknown): void {
        this.log(msg, "warn", metaData);
    }

    public debug(msg: string, metaData?: unknown): void {
        this.log(msg, "debug", metaData);
    }
}

export const logger = new Logger();
export default logger;

