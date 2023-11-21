import * as S from "@effect/schema/Schema";
import process from "node:process";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const ModeSchema = S.literal("development", "production", "test");

const mode = S.parseSync(ModeSchema)(process.env.NODE_ENV);

export const EnvSchema = S.struct({
	MODE: S.optional(ModeSchema).withDefault(() => mode),
	API_KEY: S.string.pipe(S.nonEmpty<string>()),
	ADMIN_API_KEY: S.string.pipe(S.nonEmpty<string>()),
	STRIPE_API_KEY: S.string.pipe(S.nonEmpty<string>()),
	STRIPE_WEBHOOK_SECRET: S.string.pipe(S.nonEmpty<string>()),
	PORT: S.string.pipe(S.nonEmpty<string>()),
	FASTIFY_CONFIG: S.optional(S.string),
});

export type Env = S.Schema.To<typeof EnvSchema>;
