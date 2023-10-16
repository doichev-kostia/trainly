import { env } from "./env.js";
import { join } from "desm";

export const connectionOptions = (() => {
	if (env.DB_URL) {
		return {
			connectionString: env.DB_URL,
		};
	} else {
		return {
			host: env.DB_HOST,
			port: env.DB_PORT,
			database: env.DB_NAME,
			user: env.DB_USERNAME,
			password: env.DB_PASSWORD,
		};
	}
})();

export const migrationsDirectory = join(import.meta.url, "..", "migrations");
export const schemaDirectory = join(import.meta.url, "./schema");
