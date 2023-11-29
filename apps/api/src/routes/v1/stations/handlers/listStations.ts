import { type ZodHandler } from "~/utils/types.js";
import { type ListStationQuerySchema, type StationResponseSchema } from "@trainly/contracts/stations";
import { type ListResponseSchemaType } from "@trainly/contracts";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";

type Schema = {
	querystring: typeof ListStationQuerySchema;
	response: {
		"2xx": ListResponseSchemaType<typeof StationResponseSchema>;
	};
};

export const listStations: ZodHandler<Schema> = async function listStations(request, reply) {
	const data = await StationRepository.getInstance().list(request.query);

	return data;
};
