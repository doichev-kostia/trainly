import { type Instance } from "~/utils/types.js";
import { retrieveBooking } from "./handlers/retrieve-booking.js";
import { ExpansionQuerySchema, IdParamsSchema } from "@trainly/contracts";
import { BookingResponseSchema } from "@trainly/contracts/bookings";

export default async function bookingRoutes(fastify: Instance) {
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
