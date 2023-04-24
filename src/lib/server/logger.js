import { createLogger, format, transports } from "winston";

const level = process.env.LOG_LEVEL || "debug";
const locale = process.env.LOCALE || "en-GB";
const tz = process.env.TZ || "Europe/London";

const { combine, colorize, timestamp, printf } = format;

const outputFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} | ${level} | ${message}`;
});

const tzTime = () => {
    return new Date().toLocaleString(locale, {
        timeZone: tz,
    });
};

export const logger = createLogger({
    level: level,
    format: combine(colorize(), timestamp({ format: tzTime }), outputFormat),
    transports: [new transports.Console()],
});
