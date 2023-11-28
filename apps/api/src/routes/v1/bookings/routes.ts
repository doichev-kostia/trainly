import { type ZodInstance } from "~/utils/types.js";
import { retrieveBooking } from "./handlers/retrieve-booking.js";
import { ExpansionQuerySchema, IdParamsSchema } from "@trainly/contracts";
import { BookingResponseSchema } from "@trainly/contracts/bookings";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

export default async function bookingRoutes(fastify: ZodInstance) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);
	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			querystring: ExpansionQuerySchema,
			response: {
				"2xx": BookingResponseSchema,
			},
		},
		handler: retrieveBooking,
	});
}
