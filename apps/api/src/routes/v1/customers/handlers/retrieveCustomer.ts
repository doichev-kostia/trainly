import { type Handler } from "~/utils/types.js";
import { type IdParamsSchema } from "@trainly/contracts";
import {
	type CustomerResponseSchema,
	type RetrieveCustomerQuerySchema,
} from "@trainly/contracts/customers";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof RetrieveCustomerQuerySchema;
	response: {
		200: typeof CustomerResponseSchema;
	};
};

export const retrieveCustomer: Handler<Schema> = async function retrieveFunction(request) {
	const customer = await this.db
		.selectFrom("customer")
		.selectAll()
		.where("id", "=", request.params.id)
		.executeTakeFirst();

	if (!customer) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return customer;
};
