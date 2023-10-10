import { type Handler } from "~/utils/types.js";
import { type IdParamsSchema } from "@trainly/contracts";

type Schema = {
	params: typeof IdParamsSchema;
};

export const deleteCustomer: Handler<Schema> = async function deleteCustomer(request) {
	const customer = await this.db
		.deleteFrom("customer")
		.where("id", "=", request.params.id)
		.executeTakeFirst();

	if (!customer.numDeletedRows) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return;
};
