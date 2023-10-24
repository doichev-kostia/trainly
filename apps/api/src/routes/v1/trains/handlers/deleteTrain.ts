import { type IdParamsSchema } from "@trainly/contracts";
import { type Handler } from "~/utils/types.js";
import { TrainRepository } from "../train.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
};

export const deleteTrain: Handler<Schema> = async function deleteTrain(request) {
	const result = await TrainRepository.getInstance().deleteTrain(request.params.id);

	if (!result.affectedRows) {
		throw this.httpErrors.notFound("Train not found");
	}

	return;
};
