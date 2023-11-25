import { type ErrorService } from "~/services/error/types.js";
import { logger } from "~/configs/logger.js";

export class LocalErrorService implements ErrorService {
	captureException(exception: Error): void {
		logger.error(exception);
	}

	captureMessage(message: string): void {
		logger.error(message);
	}
}
