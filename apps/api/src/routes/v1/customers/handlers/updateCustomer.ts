import { type IdParamsSchema } from "@trainly/contracts";
import { type CustomerResponseSchema, type UpdateCustomerBodySchema } from "@trainly/contracts/customers";
import { type ZodHandler } from "~/utils/types.js";
import { CustomerRepository } from "~/routes/v1/customers/customer.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	body: typeof UpdateCustomerBodySchema;
	response: {
		"2xx": typeof CustomerResponseSchema;
	};
};

export const updateCustomer: ZodHandler<Schema> = async function updateCustomer(request) {
	const customer = await CustomerRepository.getInstance().update(request.params.id, request.body);

	if (!customer) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return customer;
};
