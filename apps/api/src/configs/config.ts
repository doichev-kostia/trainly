import fp from "fastify-plugin";
import { type Env, EnvSchema } from "./env.schema.js";
import { loadEnv, parseEnv } from "@trainly/utils";
import { StatusCodes } from "#constants";

declare module "fastify" {
	interface FastifyInstance {
		secrets: Env;
		httpStatus: typeof StatusCodes;
	}
}

export const configLoader = fp(
	async function configLoader(fastify) {
		loadEnv();

		const env = parseEnv(EnvSchema);

		fastify.decorate("secrets", env);
		fastify.decorate("httpStatus", StatusCodes);
	},
	{ name: "application-configuration" },
);
