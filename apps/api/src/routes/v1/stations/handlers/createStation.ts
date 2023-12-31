import {
	type CreateStationBodySchema,
	type StationResponse,
	type StationResponseSchema,
} from "@trainly/contracts/stations";
import { type ZodHandler } from "~/utils/types.js";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";
import { AddressRepository } from "~/routes/v1/addresses/address.repository.js";
import { StatusCodes } from "#constants";

type Schema = {
	body: typeof CreateStationBodySchema;
	response: {
		"2xx": typeof StationResponseSchema;
	};
};

export const createStation: ZodHandler<Schema> = async function createStation(request, reply) {
	const { address: addressBody, ...stationBody } = request.body;
	const station = await StationRepository.getInstance().create(stationBody);
	const address = await AddressRepository.getInstance().createAddress(station.id, addressBody);

	// performance reasons
	const result = station as any as StationResponse;
	// @ts-ignore
	result.address = address;

	reply.code(StatusCodes.CREATED);
	return result as any;
};
