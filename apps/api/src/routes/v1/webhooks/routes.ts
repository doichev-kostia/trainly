import { type ZodInstance } from "~/utils/types.js";
import { stripeHandler } from "~/routes/v1/webhooks/handlers/stripe.js";
import { StripeWebhookHeadersSchema } from "~/routes/v1/webhooks/schemas.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ServiceContainer } from "~/configs/services.js";
import * as O from "effect/Option";
import { type FastifyRequest } from "fastify";

export default async function webhooks(fastify: ZodInstance) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	fastify.addContentTypeParser(
		"application/json",
		{ parseAs: "buffer" },
		async function parser(request: FastifyRequest, body: Buffer) {
			try {
				const signature = request.headers["stripe-signature"];
				if (!signature || typeof signature !== "string") {
					return Promise.reject(new Error("Missing Stripe Signature"));
				}

				const event = await ServiceContainer.get("payment").parseWebhookEvent(body as Uint8Array, signature);
				if (O.isNone(event)) {
					return Promise.reject(new Error("Invalid Stripe Event"));
				}

				return event.value;
			} catch (error) {
				return Promise.reject(error);
			}
		},
	);

	fastify.route({
		method: "POST",
		url: "/stripe",
		schema: {
			headers: StripeWebhookHeadersSchema,
		},
		handler: stripeHandler,
	});
}
