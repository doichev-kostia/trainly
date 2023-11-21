import { type FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { configLoader } from "./configs/config.js";
import AutoLoad from "@fastify/autoload";
import { join } from "desm";
import { env } from "~/configs/env.js";
import { loadFastifyConfig } from "~/configs/fastify-config.js";
import * as O from "effect/Option";

export default async function application(
	fastify: FastifyInstance,
	options: Record<string, unknown>,
) {
	const fastifyConfig = await loadFastifyConfig(env.FASTIFY_CONFIG);

	let pluginOptions = {};
	if (O.isSome(fastifyConfig)) {
		fastify.log.info("Loaded fastify config");
		pluginOptions = {
			...pluginOptions,
			...fastifyConfig.value,
		};
	}

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(configLoader, Object.assign({}, options));
	fastify.log.info("Config loaded successfully.");

	fastify.register(AutoLoad, {
		dir: join(import.meta.url, "plugins"),
		dirNameRoutePrefix: false,
		ignorePattern: /.*.no-load\.(js|ts)$/,
		indexPattern: /^no$/i,
		options: Object.assign({}, pluginOptions, options),
	});

	fastify.register(AutoLoad, {
		dir: join(import.meta.url, "routes"),
		indexPattern: /.*routes(\.js|\.ts)$/i,
		ignorePattern: /.*(\.js|\.ts)$/i,
		autoHooksPattern: /.*hooks(\.js|\.ts)$/i,
		autoHooks: true,
		cascadeHooks: true,
		options: Object.assign({}, pluginOptions, options),
	});
}
