import { type IdParamsSchema } from "@trainly/contracts";
import { type TrainResponseSchema, type UpdateTrainBodySchema } from "@trainly/contracts/trains";
import { type Handler } from "~/utils/types.js";
import { TrainRepository } from "../train.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	body: typeof UpdateTrainBodySchema;
	response: {
		"2xx": typeof TrainResponseSchema;
	};
};

export const updateTrain: Handler<Schema> = async function updateTrain(request) {
	const train = await TrainRepository.getInstance().updateTrain(request.params.id, request.body);

	if (!train) {
		throw this.httpErrors.notFound("Train not found");
	}

	return train;
};
