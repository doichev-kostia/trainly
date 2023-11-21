import fp from "fastify-plugin";
import { type Env } from "./env.schema.js";
import { StatusCodes } from "#constants";
import { env } from "~/configs/env.js";
import * as S from "@effect/schema/Schema";
import * as O from "effect/Option";

type Config = Record<string, unknown>;

declare module "fastify" {
	interface FastifyInstance {
		secrets: Env;
		config: Config;
		httpStatus: typeof StatusCodes;
	}
}
const externalConfigParser = S.parseOption(S.object);

type Options = {
	config?: unknown;
} & (Record<string, unknown> & {});

export const configLoader = fp(
	async function configLoader(fastify, options?: Options) {
		let config: Config = {};

		const externalConfig = externalConfigParser(options?.config);

		if (O.isSome(externalConfig)) {
			config = {
				...config,
				...externalConfig.value,
			};
		}

		fastify.decorate("config", config);
		fastify.decorate("secrets", env);
		fastify.decorate("httpStatus", StatusCodes);
	},
	{ name: "application-configuration" },
);
