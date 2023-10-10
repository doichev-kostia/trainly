import {
	CreateCustomerBodySchema,
	CustomerResponseSchema,
	ListCustomerQuerySchema,
	RetrieveCustomerQuerySchema,
	UpdateCustomerBodySchema,
} from "@trainly/contracts/customers";
import { IdParamsSchema, ListResponseSchema } from "@trainly/contracts";
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
			body: CreateCustomerBodySchema,
			response: {
				200: CustomerResponseSchema,
			},
		},
		handler: createCustomer,
	});

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: ListCustomerQuerySchema,
			response: {
				200: ListResponseSchema(CustomerResponseSchema),
			},
		},
		handler: listCustomers,
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			querystring: RetrieveCustomerQuerySchema,
			response: {
				200: CustomerResponseSchema,
			},
		},
		handler: retrieveCustomer,
	});

	fastify.route({
		method: "PATCH",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			body: UpdateCustomerBodySchema,
			response: {
				200: CustomerResponseSchema,
			},
		},
		handler: updateCustomer,
	});

	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
		},
		handler: deleteCustomer,
	});
}

export default customerRoutes;
