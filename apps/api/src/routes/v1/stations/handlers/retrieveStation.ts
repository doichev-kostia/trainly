import {
	type RetrieveStationQuerySchema,
	type StationResponseSchema,
} from "@trainly/contracts/stations";
import { type Handler } from "~/utils/types.js";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";
import { type IdParamsSchema } from "@trainly/contracts";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof RetrieveStationQuerySchema;
	response: {
		"2xx": typeof StationResponseSchema;
	};
};

export const retrieveStation: Handler<Schema> = async function retrieveStation(request, reply) {
	const station = await StationRepository.getInstance().retrieveStation(
		request.params.id,
		request.query.expand,
	);

	if (!station) {
		throw this.httpErrors.notFound("Station not found");
	}

	return station;
};
