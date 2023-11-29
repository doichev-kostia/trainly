import { migrate as _migrate } from "drizzle-orm/node-postgres/migrator";
import { migrationsDirectory } from "./config.js";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";

export function migrate(db: NodePgDatabase<any>) {
	return _migrate(db, {
		migrationsFolder: migrationsDirectory,
		migrationsTable: "migrations",
	});
}
