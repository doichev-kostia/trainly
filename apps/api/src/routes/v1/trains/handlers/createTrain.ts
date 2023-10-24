import { type CreateTrainBodySchema, type TrainResponseSchema } from "@trainly/contracts/trains";
import { type Handler } from "~/utils/types.js";
import { TrainRepository } from "~/routes/v1/trains/train.repository.js";

type Schema = {
	body: typeof CreateTrainBodySchema;
	response: {
		"2xx": typeof TrainResponseSchema;
	};
};

export const createTrain: Handler<Schema> = async function createTrain(request, reply) {
	const train = await TrainRepository.getInstance().createTrain({
		name: request.body.name,
		totalSeats: request.body.totalSeats,
		carriageCapacity: request.body.carriageCapacity,
	});

	if (!train) {
		request.log.error("Failed to create train", { name: request.body.name });
		throw this.httpErrors.internalServerError("Failed to create a train");
	}

	reply.code(this.httpStatus.CREATED);

	return train;
};
