import { type SecretManager } from "~/services/secrets/types.js";
import { v1 } from "@google-cloud/secret-manager";
import * as O from "effect/Option";
import { milliseconds } from "~/constants.js";
import JSON5 from "json5";
import { env } from "~/configs/env.js";
import { logger } from "~/configs/logger.js";

export class GcpSecretManager implements SecretManager {
	#projectId: string;
	#client: v1.SecretManagerServiceClient;

	constructor() {
		this.#projectId = env.GCP_PROJECT_ID;
		this.#client = new v1.SecretManagerServiceClient({
			projectId: this.#projectId,
			keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
		});
	}

	async getSecret(name: string): Promise<O.Option<Record<string, string>>> {
		try {
			const [response] = await this.#client.accessSecretVersion(
				{
					name: this.constructURL(name),
				},
				{
					timeout: 5 * milliseconds.second,
				},
			);

			if (!response.payload?.data) {
				return O.none();
			}

			const data = response.payload.data.toString();
			return O.some(JSON5.parse(data));
		} catch (error) {
			logger.error(error);
			return O.none();
		}
	}

	private constructURL(name: string): string {
		return `projects/${this.#projectId}/secrets/${name}/versions/latest`;
	}
}
