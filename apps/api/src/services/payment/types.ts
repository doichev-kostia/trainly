import type * as O from "effect/Option";

export type CheckoutSessionItem = {
	price: string;
	quantity: number;
};

export type CheckoutSessionOptions = {
	email?: string;
	customerId?: string;
	callbackURL?: string;
	metadata?: Record<string, string>;
	items: CheckoutSessionItem[];
};

export type WebhookEvent = {
	type: string;
	payload: unknown;
};

export type CheckoutEvent = {
	type: "checkout.session.completed";
	payload: {
		id: string;
		paymentStatus: string;
		metadata: {
			bookingId: string;
		};
	};
};

export interface PaymentService {
	createCheckoutSession(options: CheckoutSessionOptions): Promise<O.Option<{ url: string }>>;

	parseWebhookEvent(payload: Uint8Array, signature: string): Promise<O.Option<WebhookEvent>>;

	retrievePrice(id: string): Promise<O.Option<number>>;

	prepareCheckoutEvent(event: WebhookEvent): Promise<O.Option<CheckoutEvent>>;
}
