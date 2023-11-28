import { type ZodHandler } from "~/utils/types.js";
import { StationRepository } from "~/routes/v1/stations/station.repository.js";
import { type IdParamsSchema } from "@trainly/contracts";

type Schema = {
	params: typeof IdParamsSchema;
};

export const deleteStation: ZodHandler<Schema> = async function deleteStation(request) {
	const result = await StationRepository.getInstance().del(request.params.id);

	if (!result.affectedRows) {
		throw this.httpErrors.notFound("Station not found");
	}

	return;
};
