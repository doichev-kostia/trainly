import { type Instance } from "~/utils/types.js";
import { JourneyResponseSchema, ListJourneysQuerySchema } from "@trainly/contracts/journeys";
import { ListResponseSchema } from "@trainly/contracts";
import { listAvailableJourneys } from "./handlers/list-available-journeys.js";

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
}

export default journeyRoutes;
