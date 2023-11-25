import fp from "fastify-plugin";
import fastifyBearerAuth, {
	type verifyBearerAuth,
	type FastifyBearerAuthOptions,
	type verifyBearerAuthFactory,
} from "@fastify/bearer-auth";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyAuth from "@fastify/auth";

declare module "fastify" {
	interface FastifyInstance extends FastifyAuthPlugin {}
}

interface FastifyAuthPlugin {
	verifyAuthToken: (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => void;
	regularAuthToken: (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => void;
	adminAuthToken: (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => void;
}

export default fp(
	async function authenticationPlugin(fastify: FastifyInstance) {
		const options: FastifyBearerAuthOptions = {
			keys: new Set([fastify.secrets.API_KEY, fastify.secrets.ADMIN_API_KEY]),
			addHook: false,
		};

		await fastify.register(fastifyBearerAuth, options);
		await fastify.register(fastifyAuth);

		fastify.decorate("verifyAuthToken", fastify.verifyBearerAuth as unknown as verifyBearerAuth);

		// casting because addHook: false is not affecting the type definition
		const factory = fastify.verifyBearerAuthFactory as unknown as verifyBearerAuthFactory;

		fastify.decorate(
			"regularAuthToken",
			factory({
				keys: new Set([fastify.secrets.API_KEY]),
			}),
		);

		fastify.decorate(
			"adminAuthToken",
			factory({
				keys: new Set([fastify.secrets.ADMIN_API_KEY]),
			}),
		);
	},
	{
		name: "authentication-plugin",
	},
);
