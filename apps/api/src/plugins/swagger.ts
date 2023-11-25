import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { type FastifyInstance } from "fastify";
import { createJsonSchemaTransform } from "fastify-type-provider-zod";

export default fp(
	async function swaggerConfig(fastify: FastifyInstance, options: Record<string, any>) {
		if (!fastify.config.swagger.enabled) {
			fastify.log.info("Swagger is disabled.");
			return;
		}

		const docsPrefix = "/docs";

		fastify.register(swagger, {
			routePrefix: `${docsPrefix}/openapi.json`,
			openapi: {
				info: {
					title: "Trainly API",
					description: "Trainly API Documentation",
					version: "internal",
				},
				servers: [
					{
						url: "http://127.0.0.1:{port}",
						description: "Local development server IPv4",
						variables: {
							port: {
								enum: ["8080", "8000", "3000"],
								default: "8080",
							},
						},
					},
					{
						url: "http://[::1]:{port}",
						description: "Local development server IPv6",
						variables: {
							port: {
								enum: ["8080", "8000", "3000"],
								default: "8080",
							},
						},
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
				skipList: ["/metrics", "/health"],
			}),
		} as swagger.SwaggerOptions);

		fastify.register(swaggerUI, {
			routePrefix: docsPrefix,
		});

		fastify.log.info(`Docs are available at ${docsPrefix}`);
	},
	{
		name: "swagger-config",
	},
);
