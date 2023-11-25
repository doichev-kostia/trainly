import fp from "fastify-plugin";
import { type FastifyInstance } from "fastify";
import { db } from "@trainly/db";

declare module "fastify" {
	interface FastifyInstance {
		db: typeof db;
	}
}

export default fp(
	async function dbPlugin(fastify: FastifyInstance) {
		fastify.decorate("db", db);
	},
	{
		name: "db-plugin",
	},
);
