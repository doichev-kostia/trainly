import type { Actions, PageServerLoad } from "./$types";
import { api } from "~/api/client";
import type { Seat } from "./types";
import { transformFormDataToObject } from "$lib/utils";
import type { CreateBookingBody } from "@trainly/contracts/bookings";
import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { CreateBookingBodySchema } from "@trainly/contracts/bookings";

export const load: PageServerLoad = async (
	event,
): Promise<{
	seats: Seat[];
	totalPrice: number;
	meta: {
		title: string;
	};
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
		meta: {
			title: "Confirmation | Journey",
		},
	};
};

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const object = CreateBookingBodySchema.parse(transformFormDataToObject(data));

		const body: CreateBookingBody = {
			callbackURL: new URL("bookings", event.url.origin).toString(),
			...object,
		};
		const response = await api.checkout.create(body);

		throw redirect(303, response.url);
	},
} satisfies Actions;
