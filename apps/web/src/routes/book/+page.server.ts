import type { PageServerLoad } from "./$types";
import { api } from "~/api/client";
import type { ListResponse } from "@trainly/contracts";
import type { JourneyResponse } from "@trainly/contracts/journeys";
import type { JourneyStopResponse } from "@trainly/contracts/journey-stops";
import { HTTPError } from "ky";

export const load: PageServerLoad = async (event) => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");

	if (!from || !to || !date) {
		return {
			routes: [],
			from: null,
			to: null,
			date: null,
		};
	}

	let journeys: ListResponse<JourneyResponse> = {
		items: [],
		count: 0,
	};

	try {
		journeys = await api.journeys.list({
			departure: from,
			arrival: to,
			date: new Date(date),
			minSeats: 1,
			expand: [
				"journeyStops",
				"journeyStops.stop",
				"journeyStops.stop.platform",
				"journeyStops.stop.platform.station",
			],
			limit: 12,
		});
	} catch (error) {
		if (error instanceof HTTPError) {
			const data = await error.response.text();
			console.error(data);
		}
		console.error(error);
	}

	let departureStopId: string | undefined;
	if (journeys.items.length > 0) {
		departureStopId = journeys.items[0].journeyStops?.find(
			(jst: JourneyStopResponse) => jst.stop?.platform?.station?.name === from,
		)?.stop?.id;
	}

	let arrivalStopId: string | undefined;
	if (journeys.items.length > 0) {
		arrivalStopId = journeys.items[0].journeyStops?.find(
			(jst: JourneyStopResponse) => jst.stop?.platform?.station?.name === to,
		)?.stop?.id;
	}

	if (!departureStopId || !arrivalStopId) {
		return {
			routes: [],
			from,
			to,
			date,
		};
	}

	const routes = journeys.items.map((journey) => {
		const departureStop = journey.journeyStops?.find(
			(jst: JourneyStopResponse) => jst.stop?.id === departureStopId,
		);
		const arrivalStop = journey.journeyStops?.find(
			(jst: JourneyStopResponse) => jst.stop?.id === arrivalStopId,
		);

		if (!departureStop || !arrivalStop) {
			throw new Error("Could not find departure or arrival stop");
		}

		return {
			id: journey.id,
			startDate: departureStop.expectedArrival,
			endDate: arrivalStop.expectedArrival,
		};
	});

	return {
		routes,
		from,
		to,
		date,
	};
};
