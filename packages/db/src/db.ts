import postgres, { type PostgresType } from "postgres";
import * as schema from "./schema/index.js";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { type Logger } from "drizzle-orm";
import { match, P } from "ts-pattern";
import * as E from "effect/Either";

type ConnectionOptions =
	| {
			connectionString: string;
	  }
	| {
			host: string;
			port: number;
			database: string;
			user: string;
			password: string;
	  };

type Options = {
	connectionOptions: ConnectionOptions;
	logger: boolean | Logger;
};

export type Schema = typeof schema;
export type DB = PostgresJsDatabase<Schema>;

export function init(options: Options): E.Either<unknown, DB> {
	try {
		const client = match(options.connectionOptions)
			.with({ connectionString: P._ }, (connectionOptions) => postgres(connectionOptions.connectionString))
			.otherwise((connectionOptions: postgres.Options<Record<string, PostgresType>>) =>
				postgres(connectionOptions),
			);

		return E.right(
			drizzle(client, {
				logger: options.logger,
				schema,
			}),
		);
	} catch (error) {
		return E.left(error);
	}
}

export * from "drizzle-orm";
export type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
export type { PgDatabase } from "drizzle-orm/pg-core";
