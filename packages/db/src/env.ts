import * as fs from "node:fs";
import * as process from "node:process";
import path from "node:path";

import { parse } from "dotenv";

import { pipe } from "effect";
import * as E from "effect/Either";
import * as O from "effect/Option";
import * as S from "@effect/schema/Schema";
import { type ParseError } from "@effect/schema/ParseResult";
import { TreeFormatter } from "@effect/schema";

const EnvSchema = S.union(
	S.struct({
		DB_URL: S.string.pipe(S.nonEmpty<string>()),
	}),
	S.struct({
		DB_HOST: S.string.pipe(S.nonEmpty<string>()),
		DB_PORT: S.string.pipe(
			S.transform(
				S.number,
				(x) => parseInt(x, 10),
				(x) => x.toString(),
			),
		),
		DB_NAME: S.string.pipe(S.nonEmpty<string>()),
		DB_USERNAME: S.string.pipe(S.nonEmpty<string>()),
		DB_PASSWORD: S.string.pipe(S.nonEmpty<string>()),
	}),
);

type Env = S.Schema.To<typeof EnvSchema>;

const envFile = `.env`;
const emptyRecord: Record<string, any> = {};

const lookupFile = (file: string): O.Option<string> => {
	const fullPath = path.resolve(file);
	if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
		return O.some(fullPath);
	}

	return O.none();
};

const parseEnv = (file: string): O.Option<Record<string, any>> => {
	try {
		const record = parse(fs.readFileSync(file));
		return O.some(record);
	} catch (error) {
		console.error(`Failed to load env file ${file}`, error);
		return O.none();
	}
};

export const loadEnv = (): E.Either<ParseError, Env> => {
	const result = pipe(
		lookupFile(envFile),
		O.flatMap((f) => parseEnv(f)),
		(record) => O.getOrElse(record, () => emptyRecord),
		(record) => Object.assign({}, record, process.env),
		(record) => S.parseEither(EnvSchema)(record, { errors: "all" }),
	);

	return result;
};

const record = loadEnv();
if (E.isLeft(record)) {
	console.error("Invalid environment variables ❌");
	console.error(TreeFormatter.formatErrors(record.left.errors));
	process.exit(1);
}

export const env = record.right;
