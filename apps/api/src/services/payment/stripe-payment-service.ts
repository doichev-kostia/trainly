import {
	type CheckoutEvent,
	type CheckoutSessionOptions,
	type PaymentService,
	type WebhookEvent,
} from "~/services/payment/types.js";
import { Stripe } from "stripe";
import * as O from "effect/Option";
import * as S from "@effect/schema/Schema";
import { logger } from "~/configs/logger.js";
import { context, trace } from "@opentelemetry/api";
import { toOpenTelemetryAttributes } from "~/utils/helpers.js";
import { match, P } from "ts-pattern";

const CheckoutEventSchema = S.parseOption(
	S.struct({
		object: S.struct({
			id: S.string,
			object: S.literal("checkout.session"),
			metadata: S.struct({
				bookingId: S.string,
			}),
			payment_status: S.string,
		}),
	}),
);

export class StripePaymentService implements PaymentService {
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

	async retrievePrice(id: string): Promise<O.Option<number>> {
		try {
			const price = await this.#client.prices.retrieve(id);

			const span = trace.getSpan(context.active());
			span?.addEvent("price.retrieved", {
				"price.id": price.id,
			});

			if (!price.unit_amount) {
				return O.none();
			}

			return O.some(price.unit_amount);
		} catch (error) {
			const span = trace.getSpan(context.active());
			span?.recordException(error);
			span?.end();
			logger.error("Failed to retrieve the price");
			logger.error(error);
			return O.none();
		}
	}

	async prepareCheckoutEvent(event: WebhookEvent): Promise<O.Option<CheckoutEvent>> {
		if (event.type !== "checkout.session.completed") {
			return O.none();
		}

		const payload = CheckoutEventSchema(event.payload);

		if (O.isNone(payload)) {
			return O.none();
		}

		const { object } = payload.value;

		return O.some({
			type: "checkout.session.completed",
			payload: {
				id: object.id,
				paymentStatus: object.payment_status,
				metadata: {
					bookingId: object.metadata.bookingId,
				},
			},
		});
	}
}
