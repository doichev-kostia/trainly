import type { FastifyServerOptions } from "fastify";
import { randomUUID } from "node:crypto";

export const options = {
	genReqId() {
		return randomUUID();
	},
} satisfies FastifyServerOptions;
