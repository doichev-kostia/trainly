import "./boot.js";

import Fastify from "fastify";
import closeWithGrace from "close-with-grace";
import { logger } from "~/configs/logger.js";
import { config } from "~/configs/config.js";
import { env } from "~/configs/env.js";
import { secrets } from "~/configs/secrets.js";

const app = Fastify({
	logger,
});

app.register(import("./app.js"), {
	env,
	config,
	secrets,
});

const closeListeners = closeWithGrace({ delay: config.fastify.graceCloseDelay }, async function ({
	signal,
	err,
	manual,
}) {
	if (err) {
		app.log.error(err);
	}
	await app.close();
} as closeWithGrace.CloseWithGraceAsyncCallback);

app.addHook("onClose", (instance, done) => {
	closeListeners.uninstall();
	done();
});

app.listen({ port: parseInt(env.PORT) }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
