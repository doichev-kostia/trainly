import {
	type CreateStationBodySchema,
	type StationResponse,
	type StationResponseSchema,
} from "@trainly/contracts/stations";
import { type Handler } from "~/utils/types.js";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";
import { AddressRepository } from "~/routes/v1/addresses/address.repository.js";

type Schema = {
	body: typeof CreateStationBodySchema;
	response: {
		"2xx": typeof StationResponseSchema;
	};
};

export const createStation: Handler<Schema> = async function createStation(request, reply) {
	const { address: addressBody, ...stationBody } = request.body;
	const station = await StationRepository.getInstance().create(stationBody);
	const address = await AddressRepository.getInstance().createAddress(station.id, addressBody);

	// performance reasons
	const result = station as any as StationResponse;
	result.address = address;

	reply.code(this.httpStatus.CREATED);
	return result;
};
