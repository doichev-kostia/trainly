import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import * as path from "node:path";
import swaggerUI from "@fastify/swagger-ui";
import { type FastifyInstance } from "fastify";
import { createJsonSchemaTransform } from "fastify-type-provider-zod";
import * as fs from "fs";
import process from "node:process";

export default fp(
	async function swaggerConfig(fastify: FastifyInstance, options) {
		if (fastify.secrets.NODE_ENV === "production") {
			fastify.log.info("Swagger UI is disabled in production.");
			return;
		}

		fastify.addHook("onReady", async function onListen() {
			process.nextTick(async function () {
				try {
					const document = fastify.swagger({ yaml: true });
					await fs.promises.writeFile(path.resolve("./openapi.yaml"), document);
				} catch (error) {
					fastify.log.error(error, "Failed to write OpenAPI document to file.");
				}
			});
		});

		fastify.register(swagger, {
			routePrefix: "/docs/openapi.json",
			openapi: {
				info: {
					title: "Trainly API",
					description: "Trainly API Documentation",
					version: "internal",
				},
				servers: [
					{
						url: "http://localhost:8080",
						description: "Local development server",
					},
				],
				components: {
					securitySchemes: {
						BearerAuth: {
							type: "http",
							scheme: "bearer",
						},
						AdminBearerAuth: {
							type: "http",
							scheme: "bearer",
						},
					},
				},
				security: [
					{
						BearerAuth: [],
					},
				],
			},
			exposeRoute: true,
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
