import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";

// TODO: Implement rate limiting
export default fp(async function rateLimitPlugin(fastify: FastifyInstance) {}, {
	name: "rate-limit",
});
