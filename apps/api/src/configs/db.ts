import { init } from "@trainly/db";
import * as E from "effect/Either";
import { secrets } from "./secrets.js";

const result = init({
	connectionOptions: {
		connectionString: secrets.DB_URL,
	},
	logger: true, // TODO: replace with logger config
});

if (E.isLeft(result)) {
	throw result.left;
}

export const db = result.right;
