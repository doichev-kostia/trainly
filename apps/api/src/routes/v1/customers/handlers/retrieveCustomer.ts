import { type Handler } from "~/utils/types.js";
import { type IdParamsSchema } from "@trainly/contracts";
import {
	type CustomerResponseSchema,
	type RetrieveCustomerQuerySchema,
} from "@trainly/contracts/customers";
import { CustomerRepository } from "~/routes/v1/customers/customer.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof RetrieveCustomerQuerySchema;
	response: {
		"2xx": typeof CustomerResponseSchema;
	};
};

export const retrieveCustomer: Handler<Schema> = async function retrieveFunction(request) {
	const customer = await CustomerRepository.getInstance().retrieveCustomer(
		request.params.id,
		request.query.expand,
	);

	const r = await CustomerRepository.getInstance().retrieveCustomer(request.params.id, [
		"bookings",
	]);

	if (!customer) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return customer;
};
