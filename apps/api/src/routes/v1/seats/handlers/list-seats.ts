import { type ListSeatsQuerySchema } from "@trainly/contracts/seats";
import { type ListResponseSchemaType } from "@trainly/contracts";
import { type SeatResponseSchema } from "@trainly/contracts/seats";
import { type ZodHandler } from "~/utils/types.js";
import { SeatRepository } from "~/routes/v1/seats/seat.repository.js";

type Schema = {
	querystring: typeof ListSeatsQuerySchema;
	response: {
		"2xx": ListResponseSchemaType<typeof SeatResponseSchema>;
	};
};

export const listSeats: ZodHandler<Schema> = async function listSeats(request, reply) {
	const { journeyId, ...params } = request.query;
	const result = await SeatRepository.getInstance().list(journeyId, params);

	return result as any;
};
