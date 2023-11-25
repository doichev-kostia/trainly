// TODO: create a service that will be used for prod (open telemetry, sentry) and for testing (logging)
export interface ErrorService {
	captureException(exception: Error): void;
	captureMessage(message: string): void;
}
