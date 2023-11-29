import { type ErrorService } from "./types.js";
import * as Sentry from "@sentry/node";

// TODO: accept transformers that will process the event before sending it to Sentry (beforeSend)
// TODO: accept transformers that will process the bread crumb before sending it to Sentry (beforeBreadcrumb)
// those should be pure functions that return the transformed event or breadcrumb, no side effects, no exceptions!
// TODO: mask sensitive data

type Options = {
	dsn: string;
	environment: string;
};

export class SentryErrorService implements ErrorService {
	constructor(options: Options) {
		Sentry.init({
			dsn: options.dsn,
			environment: options.environment,
			integrations: [],
		});
	}

	captureException(exception: Error) {
		throw new Error("Not implemented");
	}

	captureMessage(message: string) {
		throw new Error("Not implemented");
	}
}
