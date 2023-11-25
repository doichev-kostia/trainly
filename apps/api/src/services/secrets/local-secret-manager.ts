import { type SecretManager } from "src/services/secrets/types.js";
import * as O from "effect/Option";
import fs from "fs";
import path from "node:path";
import JSON5 from "json5";
import { logger } from "~/configs/logger.js";

export class LocalSecretManager implements SecretManager {
	async getSecret(name: string): Promise<O.Option<Record<string, string>>> {
		try {
			const filepath = path.resolve(name);
			const data = await fs.promises.readFile(filepath, "utf-8");

			return O.some(JSON5.parse(data));
		} catch (error) {
			logger.error(error);
			return O.none();
		}
	}
}
