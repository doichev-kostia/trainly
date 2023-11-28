import { type IdParamsSchema } from "@trainly/contracts";
import { type StationResponseSchema, type UpdateStationBodySchema } from "@trainly/contracts/stations";
import { type ZodHandler } from "~/utils/types.js";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	body: typeof UpdateStationBodySchema;
	response: {
		"2xx": typeof StationResponseSchema;
	};
};

export const updateStation: ZodHandler<Schema> = async function updateStation(request, reply) {
	const station = await StationRepository.getInstance().update(request.params.id, request.body);

	if (!station) {
		throw this.httpErrors.notFound("Station not found");
	}

	return station as any;
};
