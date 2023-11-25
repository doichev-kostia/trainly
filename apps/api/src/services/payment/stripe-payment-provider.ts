import { type CheckoutSessionOptions, type PaymentProvider, type WebhookEvent } from "~/services/payment/types.js";
import { Stripe } from "stripe";
import * as O from "effect/Option";
import { logger } from "~/configs/logger.js";
import { context, trace } from "@opentelemetry/api";
import { toOpenTelemetryAttributes } from "~/utils/helpers.js";
import { match, P } from "ts-pattern";

export class StripePaymentProvider implements PaymentProvider {
	#client: Stripe;
	#webhookSecret: string;

	constructor({
		apiKey,
		webhookSecret,
		apiVersion = "2023-08-16",
	}: {
		apiKey: string;
		webhookSecret: string;
		apiVersion?: "2023-08-16";
	}) {
		this.#webhookSecret = webhookSecret;
		this.#client = new Stripe(apiKey, {
			apiVersion,
		});
	}

	get client(): Stripe {
		return this.#client;
	}

	async createCheckoutSession(options: CheckoutSessionOptions): Promise<O.Option<{ url: string }>> {
		try {
			const successUrl = match(options.callbackURL)
				.with(P.string, (url) => {
					const u = new URL(url);
					u.searchParams.append("status", "success");
					return u.toString();
				})
				.otherwise(() => {
					return undefined;
				});

			const cancelUrl = match(options.callbackURL)
				.with(P.string, (url) => {
					const u = new URL(url);
					u.searchParams.append("status", "cancel");
					return u.toString();
				})
				.otherwise(() => {
					return undefined;
				});

			const session = await this.#client.checkout.sessions.create({
				mode: "payment",
				customer_email: options.email,
				customer: options.customerId,
				metadata: options.metadata,
				line_items: options.items.map((item) => ({
					price: item.price,
					quantity: item.quantity,
				})),
				success_url: successUrl,
				cancel_url: cancelUrl,
			});

			const span = trace.getSpan(context.active());
			span?.addEvent("checkout.session.created", {
				"checkout.session.id": session.id,
				"checkout.session.customer":
					typeof session.customer === "string" ? session.customer : session.customer?.id,
			});

			if (!session.url) {
				return O.none();
			}

			return O.some({
				url: session.url,
			});
		} catch (error) {
			const span = trace.getSpan(context.active());
			span?.recordException(error);
			span?.setAttributes(
				toOpenTelemetryAttributes({
					customerId: options.customerId,
					customerEmail: options.email,
					meta: options.metadata,
				}),
			);

			span?.end();
			logger.error("Failed to create the checkout session");
			logger.error(error);
			return O.none();
		}
	}

	async parseWebhookEvent(payload: Uint8Array, signature: string): Promise<O.Option<WebhookEvent>> {
		try {
			const event = await this.#client.webhooks.constructEvent(
				payload.toString(),
				signature,
				this.#webhookSecret,
			);

			const span = trace.getSpan(context.active());
			span?.addEvent("webhook.event.parsed", {
				"webhook.event.type": event.type,
				"webhook.event.id": event.id,
			});

			return O.some({
				type: event.type,
				payload: event.data,
			});
		} catch (error) {
			const span = trace.getSpan(context.active());
			span?.recordException(error);
			span?.end();
			logger.error("Failed to parse the webhook event");
			logger.error(error);
			return O.none();
		}
	}
}
