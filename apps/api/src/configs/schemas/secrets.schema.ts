import * as S from "@effect/schema/Schema";
import { url } from "~/utils/validation.js";

export const SecretsSchema = S.struct({
	API_KEY: S.string.pipe(S.nonEmpty<string>()),
	ADMIN_API_KEY: S.string.pipe(S.nonEmpty<string>()),
	DB_URL: S.string.pipe(S.nonEmpty<string>()),
	STRIPE_API_KEY: S.string.pipe(S.nonEmpty<string>()),
	STRIPE_WEBHOOK_SECRET: S.string.pipe(S.nonEmpty<string>()),
	SENTRY_DSN: S.string.pipe(url<string>()),
	RESEND_API_KEY: S.string.pipe(S.nonEmpty<string>()),
});

export type Secrets = S.Schema.To<typeof SecretsSchema>;
