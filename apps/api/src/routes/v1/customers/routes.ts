import {
	CreateCustomerBodySchema,
	CustomerResponseSchema,
	ListCustomerQuerySchema,
	UpdateCustomerBodySchema,
} from "@trainly/contracts/customers";
import { ExpansionQuerySchema, IdParamsSchema, ListResponseSchema } from "@trainly/contracts";
import { type Instance } from "~/utils/types.js";

import { createCustomer } from "./handlers/createCustomer.js";
import { listCustomers } from "./handlers/listCustomers.js";
import { retrieveCustomer } from "./handlers/retrieveCustomer.js";
import { updateCustomer } from "./handlers/updateCustomer.js";
import { deleteCustomer } from "./handlers/deleteCustomer.js";

async function customerRoutes(fastify: Instance): Promise<void> {
	fastify.addHook("onRequest", fastify.verifyAuthToken);

	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			operationId: "create",
			body: CreateCustomerBodySchema,
			response: {
				"2xx": CustomerResponseSchema,
			},
		},
		handler: createCustomer,
	});

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			operationId: "list",
			querystring: ListCustomerQuerySchema,
			response: {
				"2xx": ListResponseSchema(CustomerResponseSchema),
			},
		},
		handler: listCustomers,
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			operationId: "retrieve",
			params: IdParamsSchema,
			querystring: ExpansionQuerySchema,
			response: {
				"2xx": CustomerResponseSchema,
			},
		},
		handler: retrieveCustomer,
	});

	fastify.route({
		method: "PATCH",
		url: "/:id",
		schema: {
			operationId: "update",
			params: IdParamsSchema,
			body: UpdateCustomerBodySchema,
			response: {
				"2xx": CustomerResponseSchema,
			},
		},
		handler: updateCustomer,
	});

	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			operationId: "del",
			params: IdParamsSchema,
		},
		handler: deleteCustomer,
	});
}

export default customerRoutes;
