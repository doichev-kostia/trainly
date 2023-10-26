import { type IdParamsSchema } from "@trainly/contracts";
import {
	type AddressResponseSchema,
	type UpdateAddressBodySchema,
} from "@trainly/contracts/addresses";
import { type Handler } from "~/utils/types.js";
import { AddressRepository } from "~/routes/v1/addresses/address.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	body: typeof UpdateAddressBodySchema;
	response: {
		"2xx": typeof AddressResponseSchema;
	};
};

export const updateAddress: Handler<Schema> = async function updateAddress(request) {
	const address = await AddressRepository.getInstance().updateAddress(
		request.params.id,
		request.body,
	);

	if (!address) {
		throw this.httpErrors.notFound("Address not found");
	}

	return address;
};
