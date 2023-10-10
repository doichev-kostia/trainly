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

		fastify.addHook("onClose", async function () {
			fastify.log.info("Closing database connection...");
			await db.destroy();
			fastify.log.info("Database connection closed");
		});
	},
	{
		name: "db-plugin",
		dependencies: ["application-configuration"],
	},
);
