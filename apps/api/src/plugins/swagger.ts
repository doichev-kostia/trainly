import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import * as path from "node:path";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async function swaggerConfig(fastify, options) {
	const packageJSON =  await import(path.resolve('package.json'), {
		assert: {
			type: 'json'
		}
	});

	const version = packageJSON.version;

	fastify.register(swagger, {
		routePrefix: "/docs/openapi.json",
		swagger: {
			info: {
				title: "Fastify API",
				description: "Fastify guide",
				version
			}
		}
	} as swagger.SwaggerOptions)

	fastify.register(swaggerUI, {
		routePrefix: "/docs",
	})
}, {
	name: "swagger-config",
	dependencies: ["application-configuration"]
})
