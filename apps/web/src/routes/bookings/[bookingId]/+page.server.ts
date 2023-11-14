import type { PageServerLoad } from "./$types";
import { api } from "~/api/client";
import type { BookingResponse } from "@trainly/contracts/bookings";
import type { JourneyResponse } from "@trainly/contracts/journeys";
import type { StationResponse } from "@trainly/contracts/stations";

export const load: PageServerLoad = async (
	event,
): Promise<{
	booking: BookingResponse;
	journey: JourneyResponse;
	departureStation: StationResponse;
	arrivalStation: StationResponse;
}> => {
	const bookingId = event.params.bookingId;

	// TODO: THIS IS MADNESS, I NEED TO FIX THIS

	const booking = await api.bookings.retrieve(bookingId, {
		expand: ["tickets", "tickets.seat", "tickets.passenger"],
	});

	const journeyId = booking.tickets?.[0]?.seat?.journeyId;

	const journey = await api.journeys.retrieve(journeyId as string, {
		expand: [
			"route",
			"route.stops",
			"route.train",
			"route.stops.platform",
			"route.stops.platform.station",
		],
	});

	// TODO: which stop has I booked the ticket for?
	const departureStation = journey.route?.stops?.[0]?.platform?.station as any;
	const arrivalStation = journey.route?.stops?.[journey.route?.stops?.length - 1]?.platform
		?.station as any;

	return {
		booking,
		journey,
		departureStation,
		arrivalStation,
	};
};
