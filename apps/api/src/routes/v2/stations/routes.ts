import { type Instance } from "~/utils/types.js";
import { ListStationsQuerySchema, ListStationsResponseSchema } from "~/routes/v2/stations/schemas.js";
import { listStationsHandler } from "~/routes/v2/stations/handlers/list-stations.js";

export default async function stationRoutes(fastify: Instance) {
	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: ListStationsQuerySchema,
			response: {
				// @ts-ignore
				"2xx": ListStationsResponseSchema,
			},
		},
		handler: listStationsHandler(fastify),
	});
}
