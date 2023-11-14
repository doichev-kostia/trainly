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
			journeys: [],
			from: null,
			to: null,
			date: null,
		};
	}

	let journeyList: ListResponse<JourneyResponse> = {
		items: [],
		count: 0,
	};

	try {
		journeyList = await api.journeys.list({
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

	const journeys = journeyList.items.map((journey) => {
		const departureStop = journey.journeyStops?.find(
			(jst: JourneyStopResponse) => jst.stop?.platform?.station?.name === from,
		);
		const arrivalStop = journey.journeyStops?.find(
			(jst: JourneyStopResponse) => jst.stop?.platform?.station?.name === to,
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
		journeys,
		from,
		to,
		date,
	};
};
