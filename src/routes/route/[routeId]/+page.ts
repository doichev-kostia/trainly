import type { PageLoad } from "./$types";
import { type Route, routes } from "~/data";

export const load: PageLoad = async (event): Promise<{
	backlink: string | null;
	route: Route,
	from: string | null;
	to: string | null;
	date: string | null;
}> => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");

	if (!from || !to || !date) {
		throw new Error("Invalid parameters");
	}

	let backlink = event.url.searchParams.get("backlink");

	if (backlink) {
		const url = new URL(backlink, event.url.origin);
		url.searchParams.set("from", from || "");
		url.searchParams.set("to", to || "");
		url.searchParams.set("date", date || "");
		backlink = url.toString();
	}

	const route = routes.find((route) => route.id === event.params.routeId);

	if (!route) {
		throw new Error("Route not found");
	}

	return {
		backlink,
		route,
		from,
		to,
		date,
	}
}
