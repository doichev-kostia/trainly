import { API } from "@trainly/api-client";
import { PRIVATE_API_KEY } from "$env/static/private";

export const api = new API(PRIVATE_API_KEY, {
	host: "localhost",
	port: 8080,
	protocol: "http",
});
