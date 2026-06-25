import winston from "winston";
import { env } from "./env.js";

const sensitivePaths = ["req.headers.authorization", "req.headers.cookie"];

function sanitize(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const result = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const path of sensitivePaths) {
    const parts = path.split(".");
    let current = result;
    let i = 0;
    for (; i < parts.length - 1; i++) {
      if (current[parts[i]] == null || typeof current[parts[i]] !== "object") break;
      current = current[parts[i]];
    }
    if (i === parts.length - 1 && current[parts[i]] !== undefined) {
      current[parts[i]] = "[Redacted]";
    }
  }
  return result;
}

const winstonLogger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: env.NODE_ENV !== "production"
    ? winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} ${level}: ${message}${metaStr}`;
        })
      )
    : winston.format.json(),
  transports: [new winston.transports.Console()],
});

const handler = {
  get(target, prop) {
    if (prop === "fatal") {
      return (obj, msg) => {
        if (msg === undefined) return target.error(obj);
        if (obj instanceof Error) {
          return target.error(msg, sanitize({ err: obj.message, stack: obj.stack }));
        }
        return target.error(msg, sanitize(obj));
      };
    }
    if (typeof target[prop] === "function") {
      return function (...args) {
        if (args.length <= 1) return target[prop](...args);
        const [obj, msg] = args;
        if (obj instanceof Error) {
          return target[prop](msg, sanitize({ err: obj.message, stack: obj.stack }));
        }
        return target[prop](msg, sanitize(obj));
      };
    }
    return target[prop];
  },
};

const logger = new Proxy(winstonLogger, handler);

export default logger;
