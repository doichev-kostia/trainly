import * as S from "@effect/schema/Schema";
import * as O from "effect/Option";
import path from "node:path";
import fs from "fs";
import { pipe } from "effect";

const fastifyConfigParser = S.parseOption(
	S.struct({
		pluginOptions: S.optional(S.object),
	})
);

export async function loadFastifyConfig(
	filepath?: string
): Promise<O.Option<Record<string, any>>> {
	if (!filepath) {
		return O.none();
	}
	const fastifyConfigPath = path.resolve(filepath);
	const fastifyConfig = await fs.promises.readFile(fastifyConfigPath, "utf8");
	const option = fastifyConfigParser(JSON.parse(fastifyConfig));

	const options = pipe(
		option,
		O.map((config) => config.pluginOptions)
	);

	if (O.isNone(options)) {
		return O.none();
	}

	if (options.value) {
		return O.some(options.value);
	} else {
		return O.none();
	}
}
