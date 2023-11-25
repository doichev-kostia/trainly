import * as S from "@effect/schema/Schema";
import process from "node:process";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const ModeSchema = S.literal("development", "production", "test");

const mode = S.parseSync(ModeSchema)(process.env.NODE_ENV);

export const EnvSchema = S.struct({
	MODE: S.optional(ModeSchema).withDefault(() => mode),
	CI: S.optional(S.string).withDefault(() => "false"),
	PORT: S.string.pipe(S.nonEmpty<string>()),
	APP_CONFIG: S.string,

	// GCP authentication variables:

	GCP_PROJECT_ID: S.string,
	// Path to the GCP key file https://cloud.google.com/docs/authentication/application-default-credentials
	GOOGLE_APPLICATION_CREDENTIALS: S.string,
});

export type Env = S.Schema.To<typeof EnvSchema>;
