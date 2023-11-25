import fp from "fastify-plugin";
import { type Stripe } from "stripe";
import { type FastifyInstance } from "fastify";
import { StripePaymentProvider } from "~/services/payment/stripe-payment-provider.js";
import { type PaymentProvider } from "~/services/payment/types.js";

declare module "fastify" {
	interface FastifyInstance {
		paymentProvider: PaymentProvider;
	}
}

export default fp(
	async function paymentPlugin(fastify: FastifyInstance) {
		const paymentProvider = new StripePaymentProvider({
			apiKey: fastify.secrets.STRIPE_API_KEY,
			webhookSecret: fastify.secrets.STRIPE_WEBHOOK_SECRET,
		});

		fastify.decorate("paymentProvider", paymentProvider);
	},
	{
		name: "payment",
	},
);
