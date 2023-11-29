import { type ZodInstance } from "~/utils/types.js";
import { CreateTrainBodySchema, TrainResponseSchema, UpdateTrainBodySchema } from "@trainly/contracts/trains";
import { IdParamsSchema, ListResponseSchema, PaginationQuerySchema } from "@trainly/contracts";
import { createTrain } from "./handlers/createTrain.js";
import { listTrains } from "./handlers/listTrains.js";
import { retrieveTrain } from "./handlers/retrieveTrain.js";
import { updateTrain } from "./handlers/updateTrain.js";
import { deleteTrain } from "./handlers/deleteTrain.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

async function trainRoutes(fastify: ZodInstance): Promise<void> {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);
	fastify.addHook("onRequest", fastify.verifyAuthToken);

	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			operationId: "create",
			security: [{ AdminBearerAuth: [] }],
			body: CreateTrainBodySchema,
			response: {
				"2xx": TrainResponseSchema,
			},
		},
		preHandler: fastify.auth([fastify.adminAuthToken]),
		handler: createTrain,
	});

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			operationId: "list",
			querystring: PaginationQuerySchema,
			response: {
				"2xx": ListResponseSchema(TrainResponseSchema),
			},
		},
		handler: listTrains,
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			operationId: "retrieve",
			params: IdParamsSchema,
			response: {
				"2xx": TrainResponseSchema,
			},
		},
		handler: retrieveTrain,
	});

	fastify.route({
		method: "PATCH",
		url: "/:id",
		schema: {
			operationId: "update",
			params: IdParamsSchema,
			body: UpdateTrainBodySchema,
			response: {
				"2xx": TrainResponseSchema,
			},
		},
		preHandler: fastify.auth([fastify.adminAuthToken]),
		handler: updateTrain,
	});

	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			operationId: "del",
			params: IdParamsSchema,
		},
		preHandler: fastify.auth([fastify.adminAuthToken]),
		handler: deleteTrain,
	});
}

export default trainRoutes;
