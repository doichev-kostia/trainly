import type * as O from "effect/Option";

export interface SecretManager {
	getSecret(name: string): Promise<O.Option<Record<string, string>>>;
}
