import { type TrainResponseSchema } from "@trainly/contracts/trains";
import { type Handler } from "~/utils/types.js";
import { TrainRepository } from "~/routes/v1/trains/train.repository.js";
import { type IdParamsSchema } from "@trainly/contracts";

type Schema = {
	params: typeof IdParamsSchema;
	response: {
		"2xx": typeof TrainResponseSchema;
	};
};

export const retrieveTrain: Handler<Schema> = async function retrieveTrain(request, reply) {
	const train = await TrainRepository.getInstance().retrieveTrain(request.params.id);

	if (!train) {
		throw this.httpErrors.notFound("Train not found");
	}

	return train;
};
