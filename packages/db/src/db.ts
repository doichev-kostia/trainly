import postgres, { type Options, type PostgresType } from "postgres";
import { connectionOptions } from "./config.js";
import * as schema from "./schema/index.js";
import { drizzle } from "drizzle-orm/postgres-js";

const options: Options<Record<string, PostgresType>> = {};

let client;
if (connectionOptions.connectionString) {
	client = postgres(connectionOptions.connectionString, options);
} else {
	client = postgres(Object.assign(options, connectionOptions));
}

export const db = drizzle(client, {
	logger: true,
	schema,
});
export type Schema = typeof schema;
export * from "drizzle-orm";
export type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
export type { PgDatabase } from "drizzle-orm/pg-core";
