import { type FastifyInstance } from "fastify";
import AutoLoad from "@fastify/autoload";
import { join } from "desm";
import * as S from "@effect/schema/Schema";

import { type Env } from "~/configs/schemas/env.schema.js";
import { type Config } from "~/configs/schemas/config.schema.js";
import { type Secrets } from "~/configs/schemas/secrets.schema.js";
import { serializerCompiler, validatorCompiler } from "~/utils/validation.js";

type Options = {
	env: Env;
	config: Config;
	secrets: Secrets;
};

declare module "fastify" {
	interface FastifyInstance {
		env: Env;
		config: Config;
		secrets: Secrets;
	}
}

const OptionsParser = S.parseSync(
	S.struct({
		env: S.object,
		config: S.object,
		secrets: S.object,
	}),
);

export default async function application(fastify: FastifyInstance, options: Options) {
	OptionsParser(options);

	fastify.decorate("env", options.env);
	fastify.decorate("config", options.config);
	fastify.decorate("secrets", options.secrets);

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	fastify.log.info("Config loaded successfully.");

	fastify.register(AutoLoad, {
		dir: join(import.meta.url, "plugins"),
		dirNameRoutePrefix: false,
		ignorePattern: /.*.no-load\.(js|ts)$/,
		indexPattern: /^no$/i,
		options: Object.assign({}, options),
	});

	fastify.register(AutoLoad, {
		dir: join(import.meta.url, "routes"),
		indexPattern: /.*routes(\.js|\.ts)$/i,
		ignorePattern: /.*(\.js|\.ts)$/i,
		autoHooksPattern: /.*hooks(\.js|\.ts)$/i,
		autoHooks: true,
		cascadeHooks: true,
		options: Object.assign({}, options),
	});
}

export { options } from "~/configs/server.js";
