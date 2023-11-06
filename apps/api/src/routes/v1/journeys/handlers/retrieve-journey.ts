import { type ExpansionQuerySchema, type IdParamsSchema } from "@trainly/contracts";
import { type JourneyResponseSchema } from "@trainly/contracts/journeys";
import { type Handler } from "~/utils/types.js";
import { JourneyRepository } from "../journey.repository.js";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof ExpansionQuerySchema;
	response: {
		"2xx": typeof JourneyResponseSchema;
	};
};

export const retrieveJourney: Handler<Schema> = async function retrieveJourney(request) {
	const journey = await JourneyRepository.getInstance().retrieve(
		request.params.id,
		request.query.expand,
	);

	if (!journey) {
		throw this.httpErrors.notFound("Journey not found");
	}

	return journey as any;
};
