import * as schema from "./schema/index.js";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { type Logger } from "drizzle-orm";
import * as E from "effect/Either";
import pg from "pg";

type Options = {
	connectionOptions: pg.PoolConfig;
	logger: boolean | Logger;
};

export type Schema = typeof schema;
export type DB = NodePgDatabase<Schema>;

export function init(options: Options): E.Either<unknown, DB> {
	try {
		const client = new pg.Pool(options.connectionOptions);

		pg.types.setTypeParser(pg.types.builtins.INT2, (value) => parseInt(value));
		pg.types.setTypeParser(pg.types.builtins.INT4, (value) => parseInt(value));
		pg.types.setTypeParser(pg.types.builtins.INT8, (value) => parseInt(value));

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
export type { NodePgDatabase } from "drizzle-orm/node-postgres";
export type { PgDatabase } from "drizzle-orm/pg-core";
