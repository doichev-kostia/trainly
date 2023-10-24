import { type Handler } from "~/utils/types.js";
import { type ListResponseSchemaType, type PaginationQuerySchema } from "@trainly/contracts";
import { TrainRepository } from "~/routes/v1/trains/train.repository.js";
import { type TrainResponseSchema } from "@trainly/contracts/trains";

type Schema = {
	querystring: typeof PaginationQuerySchema;
	response: {
		"2xx": ListResponseSchemaType<typeof TrainResponseSchema>;
	};
};

export const listTrains: Handler<Schema> = async function listTrains(request, reply) {
	const data = await TrainRepository.getInstance().listTrains(request.query);

	return data;
};
