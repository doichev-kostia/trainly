import fastify from "fastify";
import process from "node:process";
import { milliseconds } from "./constants.js";

const app = fastify({
	logger: {
		level: "debug",
		transport: {
			target: "pino-pretty",
		},
	},
	ignoreTrailingSlash: true,
});

process.once("SIGINT", async function closeApp() {
	app.log.info("Gracefully closing");
	const timeout = setTimeout(function forceClose() {
		app.log.error("Forcing close!");
		process.exit(1);
	}, 6 * milliseconds.second);
	timeout.unref();

	try {
		await app.close();
		app.log.info("Closed successfully");
	} catch (error) {
		app.log.error(error, "Error closing app");
	}
});

app.get("/", async (request, reply) => {
	return { hello: "world" };
});

app.ready().then(() => {
	app.log.info("All plugins are registered");
});

app.listen({
	port: 8080,
	host: "localhost",
})
	.then((address) => {
		app.log.info(`Server is running on ${address}`);
	})
	.catch((error) => {
		app.log.error(`An error has occurred. Error: ${error}`);
	});