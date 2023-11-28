import {
	type CheckoutEvent,
	type CheckoutSessionOptions,
	type PaymentService,
	type WebhookEvent,
} from "~/services/payment/types.js";
import type * as O from "effect/Option";

export class MockPaymentService implements PaymentService {
	createCheckoutSession(options: CheckoutSessionOptions): Promise<O.Option<{ url: string }>> {
		throw new Error("Method not implemented.");
	}

	parseWebhookEvent(payload: Uint8Array, signature: string): Promise<O.Option<WebhookEvent>> {
		throw new Error("Method not implemented.");
	}

	retrievePrice(id: string): Promise<O.Option<number>> {
		throw new Error("Method not implemented.");
	}

	prepareCheckoutEvent(event: WebhookEvent): Promise<O.Option<CheckoutEvent>> {
		throw new Error("Method not implemented.");
	}
}
