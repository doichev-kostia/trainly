import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async function corsConfig(fastify, options) {
	fastify.register(cors, {
		origin: "*",
	});
}, {
	name: "cors-config",
});
