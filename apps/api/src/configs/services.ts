import { match } from "ts-pattern";
import { config } from "~/configs/config.js";
import { SentryErrorService } from "~/services/error/sentry-error-service.js";
import { LocalErrorService } from "~/services/error/local-error-service.js";
import { StripePaymentService } from "~/services/payment/stripe-payment-service.js";
import { secrets } from "~/configs/secrets.js";
import { MockPaymentService } from "~/services/payment/mock-payment-service.js";
import { GcpSecretManager } from "~/services/secrets/gcp-secret-manager.js";
import { LocalSecretManager } from "~/services/secrets/local-secret-manager.js";
import { ServiceContainer } from "~/services/service-container.js";
import { env } from "~/configs/env.js";

const errorService = match(config.services.error)
	.with({ implementation: "sentry" }, () => {
		return new SentryErrorService({
			dsn: secrets.SENTRY_DSN,
			environment: env.MODE,
		});
	})
	.with({ implementation: "local" }, () => {
		return new LocalErrorService();
	})
	.exhaustive();

const paymentService = match(config.services.payment)
	.with({ implementation: "stripe" }, () => {
		return new StripePaymentService({
			apiKey: secrets.STRIPE_API_KEY,
			webhookSecret: secrets.STRIPE_WEBHOOK_SECRET,
		});
	})
	.with({ implementation: "mock" }, () => {
		return new MockPaymentService();
	})
	.exhaustive();

const secretsManager = match(config.services.secrets)
	.with({ implementation: "gcp" }, () => {
		return new GcpSecretManager();
	})
	.with({ implementation: "local" }, () => {
		return new LocalSecretManager();
	})
	.exhaustive();

const services = {
	error: errorService,
	payment: paymentService,
	secrets: secretsManager,
};

const serviceContainer = new ServiceContainer(services);

export { serviceContainer as ServiceContainer };
