import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const transportError = new transports.DailyRotateFile({
  level: "error",
  filename: "application-error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const transportCombined = new transports.DailyRotateFile({
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = createLogger({
  levels: logLevels,
  format: format.combine(format.timestamp(), format.json()),
  transports: [transportError, transportCombined],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export { logger };
