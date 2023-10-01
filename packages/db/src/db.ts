import { type DB } from "./types.js";

import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { parseEnv } from "@trainly/utils";
import { z } from "zod";

parseEnv({
	DATABASE_URL: z.string().url(),
});

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.DATABASE_URL,
		max: 10,
	}),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
	dialect,
});

export * from "./types.js";
