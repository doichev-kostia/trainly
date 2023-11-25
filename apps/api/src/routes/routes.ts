import { type Instance } from "~/utils/types.js";
import * as S from "@effect/schema/Schema";

export default async function root(fastify: Instance) {
	fastify.route({
		method: "GET",
		url: "/health",
		schema: {
			hide: true,
			response: {
				200: S.struct({
					status: S.string,
				}),
			},
		},
		handler: async function healthCheck(request, reply) {
			request.log.info("Health check");
			return {
				status: "ok",
			};
		},
	});
}
