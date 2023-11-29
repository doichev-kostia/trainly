import { type ZodInstance } from "~/utils/types.js";
import {
	CreateStationBodySchema,
	ListStationQuerySchema,
	StationResponseSchema,
	UpdateStationBodySchema,
} from "@trainly/contracts/stations";
import { ExpansionQuerySchema, IdParamsSchema, ListResponseSchema } from "@trainly/contracts";
import { createStation } from "./handlers/createStation.js";
import { listStations } from "./handlers/listStations.js";
import { retrieveStation } from "./handlers/retrieveStation.js";
import { updateStation } from "./handlers/updateStation.js";
import { deleteStation } from "./handlers/deleteStation.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

async function stationRoutes(fastify: ZodInstance): Promise<void> {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);
	fastify.addHook("onRequest", fastify.verifyAuthToken);

	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: CreateStationBodySchema,
			response: {
				"2xx": StationResponseSchema,
			},
		},
		preHandler: fastify.auth([fastify.adminAuthToken]),
		handler: createStation,
	});

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: ListStationQuerySchema,
			response: {
				"2xx": ListResponseSchema(StationResponseSchema),
			},
		},
		handler: listStations,
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			querystring: ExpansionQuerySchema,
			response: {
				"2xx": StationResponseSchema,
			},
		},
		handler: retrieveStation,
	});

	fastify.route({
		method: "PATCH",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			body: UpdateStationBodySchema,
			response: {
				"2xx": StationResponseSchema,
			},
		},
		preHandler: fastify.auth([fastify.adminAuthToken]),
		handler: updateStation,
	});

	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
		},
		preHandler: fastify.auth([fastify.adminAuthToken]),
		handler: deleteStation,
	});
}

export default stationRoutes;
