import { type IdParamsSchema } from "@trainly/contracts";
import { type AddressResponseSchema } from "@trainly/contracts/addresses";
import { type Handler } from "~/utils/types.js";
import { AddressRepository } from "~/routes/v1/addresses/address.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	response: {
		"2xx": typeof AddressResponseSchema;
	};
};

export const retrieveAddress: Handler<Schema> = async function retrieveAddress(request) {
	const address = await AddressRepository.getInstance().retrieveAddress(request.params.id);

	if (!address) {
		throw this.httpErrors.notFound("Address not found");
	}

	return address;
};
