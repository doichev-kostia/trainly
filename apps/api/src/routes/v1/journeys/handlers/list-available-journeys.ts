import { type Handler } from "~/utils/types.js";
import { JourneyRepository } from "~/routes/v1/journeys/journey.repository.js";
import {
	type JourneyResponseSchema,
	type ListJourneysQuerySchema,
} from "@trainly/contracts/journeys";
import { type ListResponseSchemaType } from "@trainly/contracts";

type Schema = {
	querystring: typeof ListJourneysQuerySchema;
	response: {
		"2xx": ListResponseSchemaType<typeof JourneyResponseSchema>;
	};
};

export const listAvailableJourneys: Handler<Schema> = async function listAvailableJourneys(
	request,
	reply,
) {
	const { departure, date, arrival, minSeats, limit, offset, expand } = request.query;
	const result = await JourneyRepository.getInstance().listAvailable(
		departure,
		arrival,
		date,
		minSeats,
		{ limit, offset, expand },
	);

	return result as any;
};
