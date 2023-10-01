import * as fs from "node:fs";
import * as process from "node:process";
import * as path from "node:path";
import { z, ZodObject, ZodRawShape } from "zod";
import { parse } from "dotenv";

/**
 * Parses environment variables using zod schema
 *
 * @example
 * ```ts
 * const env = parseEnv({
 * 	HOST: z.string().url(),
 * });
 * ```
 * @throws Error if environment variables are invalid
 * @param schema - key value pairs of environment variables and their zod schema
 */
export function parseEnv<S extends ZodRawShape>(
	schema: S | ZodObject<S>
): z.infer<z.ZodObject<S>> {
	let parsed;
	if (schema instanceof ZodObject) {
		parsed = schema.safeParse(process.env);
	} else {
	 	parsed = z.object(schema).safeParse(process.env);
	}

	if (parsed.success === false) {
		console.error(
			"❌ Invalid environment variables:",
			parsed.error.flatten().fieldErrors
		);
		throw new Error("Invalid environment variables", {
			cause: parsed.error,
		});
	}

	return parsed.data;
}

export function loadEnv() {
	process.env.NODE_ENV = process.env.NODE_ENV || "development";

	const mode = process.env.NODE_ENV;
	const envDir = process.cwd();
	// prettier-ignore
	const envFiles = [
		/** default file */ `.env`,
		/** local file */ `.env.local`,
		/** mode file */ `.env.${mode}`
	];
	const parsed = Object.fromEntries(
		envFiles.flatMap((file) => {
			const path = lookupFile(envDir, file);
			if (!path) return [];
			return Object.entries(parse(fs.readFileSync(path)));
		})
	);

	Object.keys(parsed).forEach((key) => {
		if (process.env[key] === undefined) {
			process.env[key] = parsed[key];
		}
	});
}

function lookupFile(dir: string, file: string): string | undefined {
	const fullPath = path.join(dir, file);
	if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
		return fullPath;
	}
}
