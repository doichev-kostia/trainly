import { parse } from "dotenv";
import * as fs from "node:fs";
import * as process from "node:process";
import path from "node:path";
import { EnvSchema } from "./env.schema.js";
import * as S from "@effect/schema/Schema";
import * as Either from "effect/Either";

const lookupFile = (dir: string, file: string): string | undefined => {
	const fullPath = path.join(dir, file);
	if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
		return fullPath;
	}
};

export const loadEnv = () => {
	const mode = process.env.NODE_ENV;
	const envDir = process.cwd();
	const envFiles = [
		/** default file */ `.env`,
		/** local file */ `.env.local`,
		/** mode file */ `.env.${mode}`,
		/** mode local file */ `.env.${mode}.local`,
	];
	const parsed = Object.fromEntries(
		envFiles.flatMap((file) => {
			const path = lookupFile(envDir, file);
			if (!path) return [];
			return Object.entries(parse(fs.readFileSync(path)));
		}),
	);

	Object.keys(parsed).forEach((key) => {
		process.env[key] = parsed[key];
	});

	const result = S.parseEither(EnvSchema)(process.env, {
		errors: "all",
	});
	if (Either.isLeft(result)) {
		console.error("Invalid environment variables", result.toString());
		throw new Error("Invalid environment variables");
	}

	return result.right;
};
