import { type Instance } from "~/utils/types.js";
import { IdParamsSchema } from "@trainly/contracts";
import { AddressResponseSchema, UpdateAddressBodySchema } from "@trainly/contracts/addresses";
import { retrieveAddress } from "./handlers/retrieveAddress.js";
import { updateAddress } from "./handlers/updateAddress.js";

async function addressRoutes(fastify: Instance): Promise<void> {
	fastify.addHook("onRequest", fastify.verifyAuthToken);

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			response: {
				"2xx": AddressResponseSchema,
			},
		},
		handler: retrieveAddress,
	});

	fastify.route({
		method: "PATCH",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			body: UpdateAddressBodySchema,
			response: {
				"2xx": AddressResponseSchema,
			},
		},
		handler: updateAddress,
	});
}

export default addressRoutes;
