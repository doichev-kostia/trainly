import { z } from "zod";
import { type Instance } from "~/utils/types.js";

async function internalRoutes(fastify: Instance) {
	fastify.route({
		method: "GET",
		url: "/status",
		schema: {
			description: "Returns status of the application",
			response: {
				200: z.object({
					status: z.literal("ok"),
				}),
			},
		},
		handler: async function status() {
			return {
				status: "ok" as const,
			};
		},
	});
}

export default internalRoutes;
