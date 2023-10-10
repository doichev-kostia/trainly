import { type FastifyInstance } from "fastify";
import { z } from "zod";

async function internalRoutes(fastify: FastifyInstance) {
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
				status: "ok",
			};
		},
	});
}

export default internalRoutes;
