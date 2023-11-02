import { type Handler } from "~/utils/types.js";
import { type ExpansionQuerySchema, type IdParamsSchema } from "@trainly/contracts";
import { type CustomerResponseSchema } from "@trainly/contracts/customers";
import { CustomerRepository } from "~/routes/v1/customers/customer.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof ExpansionQuerySchema;
	response: {
		"2xx": typeof CustomerResponseSchema;
	};
};

export const retrieveCustomer: Handler<Schema> = async function retrieveFunction(request) {
	const customer = await CustomerRepository.getInstance().retrieve(
		request.params.id,
		request.query.expand,
	);

	if (!customer) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return customer;
};
