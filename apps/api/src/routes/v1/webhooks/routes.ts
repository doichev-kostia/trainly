import { type Instance } from "~/utils/types.js";
import { stripeHandler } from "~/routes/v1/webhooks/handlers/stripe.js";

export default async function webhooks(fastify: Instance) {
	fastify.route({
		method: "POST",
		url: "/stripe",
		handler: stripeHandler,
	});
}
