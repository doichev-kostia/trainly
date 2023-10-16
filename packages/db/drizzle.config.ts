import type { Config } from "drizzle-kit";
import { env } from "./build/env.js";

const credentials = (() => {
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

export default {
	schema: "./build/schema/**/*.js",
	out: "./migrations",
	driver: "pg",
	dbCredentials: credentials,
} satisfies Config;
