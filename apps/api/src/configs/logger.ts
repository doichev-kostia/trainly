import { type LoggerOptions, pino } from "pino";
import { config } from "~/configs/config.js";

const loggerOptions: LoggerOptions = {
	level: config.logger.level,
	redact: {
		censor: "***",
		paths: ["req.headers.authorization"],
	},
};

if (config.logger.prettyPrint) {
	loggerOptions.transport = {
		target: "pino-pretty",
	};
}

export const logger = pino(loggerOptions);
