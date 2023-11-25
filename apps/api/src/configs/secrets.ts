import process from "node:process";

import { match } from "ts-pattern";
import * as S from "@effect/schema/Schema";
import * as O from "effect/Option";
import { pipe } from "effect";
import * as E from "effect/Either";
import { TreeFormatter } from "@effect/schema";

import { GcpSecretManager } from "~/services/secrets/gcp-secret-manager.js";
import { LocalSecretManager } from "~/services/secrets/local-secret-manager.js";

import { config } from "./config.js";
import { SecretsSchema } from "./schemas/secrets.schema.js";

const manager = match(config.secrets.manager)
	.with("gcp", () => new GcpSecretManager())
	.with("local", () => new LocalSecretManager())
	.exhaustive();

const emptyRecord: Record<string, any> = {};

const record = pipe(
	await manager.getSecret(config.secrets.name),
	(record) => O.getOrElse(record, () => emptyRecord),
	(record) => S.parseEither(SecretsSchema)(record, { errors: "all" }),
);

if (E.isLeft(record)) {
	console.error("Invalid secrets ❌");
	console.error(TreeFormatter.formatErrors(record.left.errors));
	process.exit(1);
}

export const secrets = record.right;
