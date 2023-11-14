import fp from "fastify-plugin";
import { Stripe } from "stripe";
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { Option as O } from "effect";

declare module "fastify" {
	interface FastifyInstance {
		stripe: Stripe;
		parseStripeEvent: (request: FastifyRequest) => O.Option<Stripe.Event>;
	}
}

export default fp(
	async function stripeConfig(fastify: FastifyInstance) {
		const client = new Stripe(fastify.secrets.STRIPE_API_KEY, {
			apiVersion: "2023-08-16",
		});

		fastify.decorate("stripe", client);

		fastify.decorateRequest(
			"parseStripeEvent",
			function parseStripeEvent(request: FastifyRequest): O.Option<Stripe.Event> {
				try {
					const signature = request.headers["stripe-signature"];

					if (!signature) {
						return O.none();
					}

					const event = client.webhooks.constructEvent(
						request.body as Buffer,
						signature,
						fastify.secrets.STRIPE_WEBHOOK_SECRET,
					);
					return O.some(event);
				} catch (error) {
					return O.none();
				}
			},
		);
	},
	{
		name: "stripe",
		dependencies: ["application-configuration"],
	},
);
