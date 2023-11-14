import type { PageServerLoad } from "./$types";
import type { Route } from "~/data";
import { api } from "~/api/client";
import type { ListResponse } from "@trainly/contracts";
import type { SeatClassEnum, SeatResponse } from "@trainly/contracts/seats";
import { SeatClass } from "@trainly/contracts/seats";

export const load: PageServerLoad = async (
	event,
): Promise<{
	backlink: string | null;
	journey: Route;
	seats: ListResponse<SeatResponse>;
	from: string | null;
	to: string | null;
	date: string | null;
	seatClass: SeatClassEnum;
	carriage: number;
	hasNext: boolean;
	hasPrevious: boolean;
}> => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");
	const seatClass = event.url.searchParams.get("seatClass") ?? SeatClass.standard;
	let carriage: string | null | number = event.url.searchParams.get("carriage");

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
		expand: [
			"route",
			"route.stops",
			"route.stops.platform",
			"route.stops.platform.station",
			"route.train",
		],
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

	const totalSeats = journey.route?.train?.totalSeats ?? 20;
	const carriageCapacity = journey.route?.train?.carriageCapacity ?? 20;
	const premiumCarriages = journey.route?.train?.premiumCarriages ?? 0;

	const standardOffset = premiumCarriages * carriageCapacity;

	const carriageCount = Math.ceil(totalSeats / carriageCapacity);

	let hasNext = false;
	let hasPrevious = false;

	if (carriage == null) {
		if (seatClass === SeatClass.premium) {
			carriage = 0;
		} else {
			carriage = premiumCarriages;
		}
	} else if (typeof carriage === "string") {
		carriage = Number(carriage);
	}

	if (Number.isNaN(carriage)) {
		throw new Error("Invalid carriage");
	}

	if (carriage >= carriageCount) {
		throw new Error("Invalid carriage");
	}

	if (carriage < 0) {
		throw new Error("Invalid carriage");
	}

	if (seatClass === SeatClass.premium && carriage < premiumCarriages - 1) {
		hasNext = true;
	} else if (seatClass === SeatClass.premium && carriage > 0) {
		hasPrevious = true;
	} else if (seatClass === SeatClass.standard && carriage < carriageCount - 1) {
		hasNext = true;
	} else if (seatClass === SeatClass.standard && carriage > premiumCarriages) {
		hasPrevious = true;
	}

	const seatList = await api.seats.list({
		journeyId: journey.id,
		limit: carriageCapacity,
		offset: carriage * carriageCapacity,
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
		seatClass,
		carriage, // number
		hasNext,
		hasPrevious,
	};
};
