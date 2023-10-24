import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import * as path from "node:path";
import swaggerUI from "@fastify/swagger-ui";
import { type FastifyInstance } from "fastify";
import { createJsonSchemaTransform } from "fastify-type-provider-zod";

export default fp(
	async function swaggerConfig(fastify: FastifyInstance, options) {
		if (fastify.secrets.NODE_ENV === "production") {
			fastify.log.info("Swagger UI is disabled in production.");
			return;
		}

		const packageJSON = await import(path.resolve("package.json"), {
			assert: {
				type: "json",
			},
		});

		const version = packageJSON.version;

		fastify.register(swagger, {
			routePrefix: "/docs/openapi.json",
			swagger: {
				info: {
					title: "Trainly API",
					description: "Trainly API Documentation",
					version,
				},
				host: "localhost",
				schemes: ["http", "https"],
				consumes: ["application/json"],
				produces: ["application/json", "text/html"],
				securityDefinitions: {
					Bearer: {
						type: "apiKey",
						name: "Bearer",
						in: "header",
					},
				},
			},
			transform: createJsonSchemaTransform({
				skipList: ["/_app/status"],
			}),
		} as swagger.SwaggerOptions);

		fastify.register(swaggerUI, {
			routePrefix: "/docs",
		});
	},
	{
		name: "swagger-config",
		dependencies: ["application-configuration"],
	},
);
