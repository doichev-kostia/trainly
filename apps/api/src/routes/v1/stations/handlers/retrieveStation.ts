import { type StationResponseSchema } from "@trainly/contracts/stations";
import { type ZodHandler } from "~/utils/types.js";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";
import { type ExpansionQuerySchema, type IdParamsSchema } from "@trainly/contracts";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof ExpansionQuerySchema;
	response: {
		"2xx": typeof StationResponseSchema;
	};
};

export const retrieveStation: ZodHandler<Schema> = async function retrieveStation(request, reply) {
	const station = await StationRepository.getInstance().retrieve(request.params.id, request.query.expand);

	if (!station) {
		throw this.httpErrors.notFound("Station not found");
	}

	return station;
};
