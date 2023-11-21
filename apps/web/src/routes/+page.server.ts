import type { PageServerLoad } from "./$types";
import { api } from "~/api/client";

export const load: PageServerLoad = async (event) => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");

	const stationList = await api.stations.list();

	return {
		from,
		to,
		date,
		stations: stationList.items,
		title: "Home",
	};
};
