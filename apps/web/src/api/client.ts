import { API } from "@trainly/api-client";
import { PRIVATE_API_KEY } from "$env/static/private";
import { PUBLIC_API_HOST, PUBLIC_API_PROTOCOL, PUBLIC_API_PORT } from "$env/static/public";
import { z } from "zod";

export const api = new API(PRIVATE_API_KEY, {
	host: PUBLIC_API_HOST,
	port: Number(PUBLIC_API_PORT.trim()),
	protocol: z.enum(["http", "https"]).parse(PUBLIC_API_PROTOCOL),
});
