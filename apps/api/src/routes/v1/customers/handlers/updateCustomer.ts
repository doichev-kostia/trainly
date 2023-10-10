import { type IdParamsSchema } from "@trainly/contracts";
import {
	type CustomerResponseSchema,
	type UpdateCustomerBody,
	type UpdateCustomerBodySchema,
} from "@trainly/contracts/customers";
import { type Handler } from "~/utils/types.js";

type Schema = {
	params: typeof IdParamsSchema;
	body: typeof UpdateCustomerBodySchema;
	response: {
		200: typeof CustomerResponseSchema;
	};
};

export const updateCustomer: Handler<Schema> = async function updateCustomer(request) {
	const customer = await this.db
		.updateTable("customer")
		.set(strip(request.body))
		.where("id", "=", request.params.id)
		.returningAll()
		.executeTakeFirst();

	if (!customer) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return customer;
};

function strip(body: UpdateCustomerBody) {
	const result: UpdateCustomerBody = {};

	for (const key in body) {
		const value = body[key as keyof UpdateCustomerBody];
		if (value !== undefined) {
			result[key as keyof UpdateCustomerBody] = value;
		}
	}

	return result;
}
