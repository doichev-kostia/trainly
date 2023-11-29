import { ListSeatsQuerySchema, SeatResponseSchema } from "@trainly/contracts/seats";
import { type ZodInstance } from "~/utils/types.js";
import { listSeats } from "./handlers/list-seats.js";
import { IdsSchema, ListResponseSchema } from "@trainly/contracts";
import { reserveSeat } from "~/routes/v1/seats/handlers/reserve-seat.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

export default async function seatRoutes(fastify: ZodInstance) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);
	fastify.addHook("onRequest", fastify.verifyAuthToken);

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: ListSeatsQuerySchema,
			response: {
				"2xx": ListResponseSchema(SeatResponseSchema),
			},
		},
		handler: listSeats,
	});

	fastify.route({
		method: "POST",
		url: "/reserve",
		schema: {
			body: IdsSchema,
		},
		handler: reserveSeat,
	});
}
