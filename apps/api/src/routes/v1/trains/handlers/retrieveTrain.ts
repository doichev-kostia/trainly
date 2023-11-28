import { type TrainResponseSchema } from "@trainly/contracts/trains";
import { type ZodHandler } from "~/utils/types.js";
import { TrainRepository } from "~/routes/v1/trains/train.repository.js";
import { type IdParamsSchema } from "@trainly/contracts";

type Schema = {
	params: typeof IdParamsSchema;
	response: {
		"2xx": typeof TrainResponseSchema;
	};
};

export const retrieveTrain: ZodHandler<Schema> = async function retrieveTrain(request, reply) {
	const train = await TrainRepository.getInstance().retrieve(request.params.id);

	if (!train) {
		throw this.httpErrors.notFound("Train not found");
	}

	return train;
};
