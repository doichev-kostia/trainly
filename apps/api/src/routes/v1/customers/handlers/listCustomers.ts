import { type Handler } from "~/utils/types.js";
import { type ListResponseSchemaType } from "@trainly/contracts";
import {
	type CustomerResponseSchema,
	type ListCustomerQuerySchema,
} from "@trainly/contracts/customers";
import { CustomerRepository } from "../customer.repository.js";

type Schema = {
	querystring: typeof ListCustomerQuerySchema;
	response: {
		"2xx": ListResponseSchemaType<typeof CustomerResponseSchema>;
	};
};

export const listCustomers: Handler<Schema> = async function listCustomers(request, reply) {
	const data = await CustomerRepository.getInstance().list(request.query);

	return data;
};
