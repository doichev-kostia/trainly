import type { PageLoad } from "./$types";
import { routes } from "~/data";



export const load: PageLoad = async (event) => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");

	return {
		routes,
		from,
		to,
		date,
	};
};
