import { migrate as _migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationsDirectory } from "./config.js";
import { db } from "./db.js";

// for migrations

export function migrate() {
	return _migrate(db, {
		migrationsFolder: migrationsDirectory,
		migrationsTable: "migrations",
	});
}
