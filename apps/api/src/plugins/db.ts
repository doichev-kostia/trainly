import fp from "fastify-plugin";
import { type DB } from "@trainly/db";
import { type Instance } from "~/utils/types.js";
import { db } from "~/configs/db.js";

declare module "fastify" {
	interface FastifyInstance {
		db: DB;
	}
}

export default fp(
	async function dbPlugin(fastify: Instance) {
		fastify.decorate("db", db);
	},
	{
		name: "db-plugin",
	},
);
