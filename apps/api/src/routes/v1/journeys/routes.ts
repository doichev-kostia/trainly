import { type Instance } from "~/utils/types.js";
import { JourneyResponseSchema, ListJourneysQuerySchema } from "@trainly/contracts/journeys";
import { ExpansionQuerySchema, IdParamsSchema, ListResponseSchema } from "@trainly/contracts";
import { listAvailableJourneys } from "./handlers/list-available-journeys.js";
import { retrieveJourney } from "~/routes/v1/journeys/handlers/retrieve-journey.js";

async function journeyRoutes(fastify: Instance) {
	fastify.addHook("onRequest", fastify.verifyAuthToken);

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: ListJourneysQuerySchema,
			response: {
				"2xx": ListResponseSchema(JourneyResponseSchema),
			},
		},
		handler: listAvailableJourneys,
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: IdParamsSchema,
			querystring: ExpansionQuerySchema,
			response: {
				"2xx": JourneyResponseSchema,
			},
		},
		handler: retrieveJourney,
	});
}

export default journeyRoutes;
