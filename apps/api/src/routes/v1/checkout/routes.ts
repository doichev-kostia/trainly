import { checkout } from "~/routes/v1/checkout/handlers/checkout.js";
import { CreateBookingBodySchema } from "@trainly/contracts/bookings";
import { UrlSchema } from "@trainly/contracts";
import { type Instance } from "~/utils/types.js";

export default async function checkoutRoutes(fastify: Instance) {
	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: CreateBookingBodySchema,
			response: {
				"2xx": UrlSchema,
			},
		},
		handler: checkout,
	});
}
