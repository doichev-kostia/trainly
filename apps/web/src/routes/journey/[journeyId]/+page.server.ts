import type { PageServerLoad } from "./$types";
import type { Route } from "~/data";
import { api } from "~/api/client";
import type { ListResponse } from "@trainly/contracts";
import type { SeatResponse } from "@trainly/contracts/build/seats";

export const load: PageServerLoad = async (
	event,
): Promise<{
	backlink: string | null;
	journey: Route;
	seats: ListResponse<SeatResponse>;
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

	const journey = await api.journeys.retrieve(event.params.journeyId, {
		expand: ["route", "route.stops", "route.stops.platform", "route.stops.platform.station"],
	});

	// seconds
	const totalDuration = journey.route?.stops?.reduce((acc, stop) => {
		return acc + stop.durationFromPrevious;
	}, 0);

	const departureDate = new Date(journey.departureTime);
	const arrivalDate = new Date(departureDate.getTime() + totalDuration! * 1000);

	const origin = journey.route?.stops?.find((stop) => stop.order === 0);
	const originStation = origin?.platform?.station?.name;
	const destination = journey.route?.stops?.find(
		(stop) => stop.order === (journey.route?.stops?.length as number) - 1,
	);
	const destinationStation = destination?.platform?.station?.name;

	if (!journey) {
		throw new Error("Route not found");
	}

	const seatList = await api.seats.list({
		journeyId: journey.id,
	});

	return {
		backlink,
		journey: {
			id: journey.id,
			startDate: departureDate,
			endDate: arrivalDate,
			origin: originStation ?? "",
			destination: destinationStation ?? "",
		},
		seats: seatList,
		from,
		to,
		date,
	};
};
