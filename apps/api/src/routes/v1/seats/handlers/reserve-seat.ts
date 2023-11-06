import { type Handler } from "~/utils/types.js";
import { type IdParamsSchema, type IdsSchema } from "@trainly/contracts";
import { SeatRepository } from "~/routes/v1/seats/seat.repository.js";
import { seatStatus } from "@trainly/db/schema/enums";

type Schema = {
	body: typeof IdsSchema;
};

export const reserveSeat: Handler<Schema> = async function reserveSeat(request, reply) {
	await SeatRepository.getInstance().updateStatus(request.body.ids, seatStatus.reserved);
};
