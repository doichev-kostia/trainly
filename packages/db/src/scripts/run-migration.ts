import { migrate } from "../migrate.js";
import { pipe } from "effect";
import { init } from "../db.js";
import { connectionOptions } from "../config.js";
import * as E from "effect/Either";
pipe(
	init({
		connectionOptions,
		logger: true,
	}),
	E.match({
		onRight: migrate,
		onLeft: Promise.reject,
	}),
)
	.then(() => {
		console.log("Migration completed");
		process.exit(0);
	})
	.catch((err) => {
		console.error("Migration failed", err);
		process.exit(1);
	});
