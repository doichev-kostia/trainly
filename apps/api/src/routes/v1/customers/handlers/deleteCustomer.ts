import { type Handler } from "~/utils/types.js";
import { type IdParamsSchema } from "@trainly/contracts";
import { CustomerRepository } from "~/routes/v1/customers/customer.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
};

export const deleteCustomer: Handler<Schema> = async function deleteCustomer(request) {
	const result = await CustomerRepository.getInstance().del(request.params.id);

	if (!result.affectedRows) {
		throw this.httpErrors.notFound("Customer not found");
	}

	return;
};
