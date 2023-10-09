import { type DB } from "./types.js";

import pg from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { parseEnv } from "@trainly/utils";
import { z } from "zod";

const schema = z.object({
	DATABASE_URL: z.string().url(),
});

parseEnv(schema);

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		connectionString: process.env.DATABASE_URL,
		max: 10,
	}),
});

export const db = new Kysely<DB>({
	dialect,
	plugins: [new CamelCasePlugin()],
});

export * from "./types.js";
