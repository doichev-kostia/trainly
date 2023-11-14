import type { PageServerLoad } from "./$types";
import { api } from "~/api/client";
import type { Seat } from "./types";

export const load: PageServerLoad = async (
	event,
): Promise<{
	seats: Seat[];
	totalPrice: number;
}> => {
	const journeyId = event.params.journeyId;
	const seatIds = event.url.searchParams.getAll("seat");

	if (seatIds.length === 0) {
		throw new Error("No seats selected");
	}

	const pricing = await api.journeys.retrievePricing(journeyId);

	const seatList = await api.seats.list({
		journeyId,
		ids: seatIds,
	});

	let totalPrice = 0;
	const seats: Seat[] = new Array(seatList.items.length);

	for (let i = 0; i < seats.length; i += 1) {
		const seat = seatList.items[i];
		const price = pricing[seat.class];

		if (!price) {
			throw new Error("Invalid ticket class");
		}

		totalPrice += price;
		seats[i] = {
			id: seat.id,
			number: seat.number,
			price,
			class: seat.class,
		};
	}
	return {
		seats,
		totalPrice,
	};
};
