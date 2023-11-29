import { env } from "./env.js";
import { join } from "desm";
import { match, P } from "ts-pattern";

export const connectionOptions = match(env)
	.with({ DB_URL: P.string }, ({ DB_URL }) => {
		return { connectionString: DB_URL };
	})
	.otherwise((options) => {
		return {
			host: options.DB_HOST,
			port: options.DB_PORT,
			database: options.DB_NAME,
			user: options.DB_USERNAME,
			password: options.DB_PASSWORD,
		};
	});

export const migrationsDirectory = join(import.meta.url, "..", "migrations");
export const schemaDirectory = join(import.meta.url, "./schema");
