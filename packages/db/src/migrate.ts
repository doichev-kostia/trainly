import { migrate as _migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationsDirectory } from "./config.js";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

export function migrate(db: PostgresJsDatabase<any>) {
	return _migrate(db, {
		migrationsFolder: migrationsDirectory,
		migrationsTable: "migrations",
	});
}
