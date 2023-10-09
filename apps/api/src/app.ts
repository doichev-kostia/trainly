import { type FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { configLoader } from "./configs/config.js";
import AutoLoad from "@fastify/autoload";
import * as url from "node:url";
import * as path from "node:path";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default async function application(
	fastify: FastifyInstance,
	options: Record<string, unknown>,
) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(configLoader, Object.assign({}, options));
	fastify.log.info("Config loaded successfully.");

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		dirNameRoutePrefix: false,
		ignorePattern: /.*.no-load\.(js|ts)$/,
		indexPattern: /^no$/i,
		options: Object.assign({}, options),
	});

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "routes"),
		indexPattern: /.*routes(\.js|\.ts)$/i,
		ignorePattern: /.*(\.js|\.ts)$/i,
		autoHooksPattern: /.*hooks(\.js|\.ts)$/i,
		autoHooks: true,
		cascadeHooks: true,
		options: Object.assign({}, options),
	});
}
