import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");

	return {
		from,
		to,
		date,
	};
};
