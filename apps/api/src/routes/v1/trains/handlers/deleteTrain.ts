import { type IdParamsSchema } from "@trainly/contracts";
import { type ZodHandler } from "~/utils/types.js";
import { TrainRepository } from "../train.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
};

export const deleteTrain: ZodHandler<Schema> = async function deleteTrain(request) {
	const result = await TrainRepository.getInstance().del(request.params.id);

	if (!result.affectedRows) {
		throw this.httpErrors.notFound("Train not found");
	}

	return;
};
