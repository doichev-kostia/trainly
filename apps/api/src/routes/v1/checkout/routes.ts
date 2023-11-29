import { checkout } from "~/routes/v1/checkout/handlers/checkout.js";
import { CreateBookingBodySchema } from "@trainly/contracts/bookings";
import { UrlSchema } from "@trainly/contracts";
import { type ZodInstance } from "~/utils/types.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

export default async function checkoutRoutes(fastify: ZodInstance) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);
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
