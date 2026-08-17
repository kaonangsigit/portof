/**
 * Structured logging utility with enhanced features
 * Provides consistent logging across the application with support for
 * different log levels, structured data, and environment-aware formatting
 */

type LogLevel = "info" | "warn" | "error" | "debug" | "verbose";
type LogFormat = "json" | "pretty" | "minimal";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
  error?: Error;
  duration?: number;
}

interface LoggerOptions {
  level?: LogLevel;
  format?: LogFormat;
  prettyPrint?: boolean;
  timestamp?: boolean;
  colorize?: boolean;
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m",    // Cyan
  verbose: "\x1b[90m",  // Gray
  info: "\x1b[32m",     // Green
  warn: "\x1b[33m",     // Yellow
  error: "\x1b[31m",    // Red
};
const RESET_COLOR = "\x1b[0m";

class Logger {
  private options: Required<LoggerOptions>;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      level: options.level || (process.env.NODE_ENV === "production" ? "info" : "debug"),
      format: options.format || (process.env.NODE_ENV === "production" ? "json" : "pretty"),
      prettyPrint: options.prettyPrint ?? (process.env.NODE_ENV !== "production"),
      timestamp: options.timestamp ?? true,
      colorize: options.colorize ?? (process.env.NODE_ENV !== "production"),
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      verbose: 1,
      info: 2,
      warn: 3,
      error: 4,
    };
    return levels[level] >= levels[this.options.level];
  }

  private formatLogEntry(entry: LogEntry): string {
    const { format, prettyPrint, timestamp, colorize } = this.options;

    switch (format) {
      case "json":
        return JSON.stringify({ ...entry });
      case "minimal":
        return `${entry.level.toUpperCase()}: ${entry.message}`;
      case "pretty":
      default: {
        const prefix = timestamp ? `[${new Date(entry.timestamp).toLocaleTimeString()}] ` : "";
        const levelPrefix = colorize
          ? `${LEVEL_COLORS[entry.level]}${entry.level.toUpperCase()}${RESET_COLOR} `
          : `${entry.level.toUpperCase()} `;

        let message = `${prefix}${levelPrefix}${entry.message}`;

        if (entry.data) {
          message += prettyPrint
            ? `\n  Data: ${JSON.stringify(entry.data, null, 2)}`
            : ` ${JSON.stringify(entry.data)}`;
        }
        if (entry.userId) {
          message += `\n  User: ${entry.userId}`;
        }
        if (entry.requestId) {
          message += `\n  Request: ${entry.requestId}`;
        }
        if (entry.error) {
          message += `\n  Error: ${entry.error.message}`;
          if (entry.error.stack && prettyPrint) {
            message += `\n  Stack: ${entry.error.stack}`;
          }
        }
        if (entry.duration !== undefined) {
          message += `\n  Duration: ${entry.duration}ms`;
        }
        return message;
      }
    }
  }

  private logInternal(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data !== undefined ? { data } : {}),
    };

    const formatted = this.formatLogEntry(entry);

    switch (level) {
      case "error":
        console.error(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
        break;
    }
  }

  info(message: string, data?: unknown, context?: Record<string, unknown>): void {
    const merged = (data !== null && typeof data === "object" && context)
      ? { ...(data as Record<string, unknown>), ...context }
      : (context ? context : data);
    this.logInternal("info", message, merged);
  }

  warn(message: string, data?: unknown, context?: Record<string, unknown>): void {
    const merged = (data !== null && typeof data === "object" && context)
      ? { ...(data as Record<string, unknown>), ...context }
      : (context ? context : data);
    this.logInternal("warn", message, merged);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errorData = error instanceof Error
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;
    const merged = (errorData !== null && typeof errorData === "object" && context)
      ? { ...(errorData as Record<string, unknown>), ...context }
      : (context ? context : errorData);
    this.logInternal("error", message, merged);
  }

  debug(message: string, data?: unknown, context?: Record<string, unknown>): void {
    const merged = (data !== null && typeof data === "object" && context)
      ? { ...(data as Record<string, unknown>), ...context }
      : (context ? context : data);
    this.logInternal("debug", message, merged);
  }

  verbose(message: string, data?: unknown, context?: Record<string, unknown>): void {
    const merged = (data !== null && typeof data === "object" && context)
      ? { ...(data as Record<string, unknown>), ...context }
      : (context ? context : data);
    this.logInternal("verbose", message, merged);
  }

  api(requestId: string, method: string, url: string, status: number, duration: number, userId?: string): void {
    const level = status >= 400 ? "warn" : "info";
    this.logInternal(level, "API request", { method, url, status, duration, requestId, userId, type: "api" });
  }

  database(query: string, duration: number, userId?: string): void {
    this.logInternal("debug", "Database query", { query, duration, userId, type: "database" });
  }

  auth(userId: string, action: string, success: boolean, reason?: string): void {
    const level = success ? "info" : "warn";
    this.logInternal(level, `Authentication ${action}`, { userId, action, success, reason, type: "auth" });
  }

  errorWithContext(message: string, error: Error, context: Record<string, unknown>): void {
    this.error(message, error, context);
  }

  performance(operation: string, duration: number, threshold?: number, context?: Record<string, unknown>): void {
    if (threshold && duration > threshold) {
      this.warn(`Slow operation: ${operation}`, { duration, threshold, ...context, type: "performance" });
    } else {
      this.debug(`Performance: ${operation}`, { duration, ...context, type: "performance" });
    }
  }

  setContext(_context: Record<string, unknown>): void {
    // Placeholder for future context management
  }

  getOptions(): LoggerOptions {
    return { ...this.options };
  }

  updateOptions(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

// Create default logger instance
const logger = new Logger();

// Create contextual loggers for different modules
export const createModuleLogger = (module: string) => {
  return {
    info: (message: string, data?: unknown) => logger.info(message, data, { module, source: module }),
    warn: (message: string, data?: unknown) => logger.warn(message, data, { module, source: module }),
    error: (message: string, error?: Error | unknown) => logger.error(message, error, { module, source: module }),
    debug: (message: string, data?: unknown) => logger.debug(message, data, { module, source: module }),
    api: (method: string, url: string, status: number, duration: number, userId?: string) =>
      logger.api(module, method, url, status, duration, userId),
    database: (query: string, duration: number, userId?: string) =>
      logger.database(query, duration, userId),
    auth: (action: string, success: boolean, reason?: string) =>
      logger.auth(module, action, success, reason),
  };
};

// Export types
export type { LogLevel, LogFormat, LoggerOptions, LogEntry };
export { Logger };

// Convenience exports
export const {
  info,
  warn,
  error,
  debug,
  verbose,
} = {
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  debug: logger.debug.bind(logger),
  verbose: logger.verbose.bind(logger),
};

export { logger };
export default logger;
