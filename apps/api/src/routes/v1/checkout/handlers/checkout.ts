import { type Handler } from "~/utils/types.js";
import { type CreateBookingBodySchema } from "@trainly/contracts/bookings";
import { BookingRepository } from "~/routes/v1/checkout/booking.repository.js";
import { db, eq } from "@trainly/db";
import { routes } from "@trainly/db/schema/routes";
import { journeys } from "@trainly/db/schema/journeys";
import { seats } from "@trainly/db/schema/seats";
import { tickets } from "@trainly/db/schema/tickets";
import { type SeatClass, seatClass } from "@trainly/db/schema/enums";
import { type UrlSchema } from "@trainly/contracts";

type Schema = {
	body: typeof CreateBookingBodySchema;
	response: {
		"2xx": typeof UrlSchema;
	};
};

export const checkout: Handler<Schema> = async function checkout(request, reply) {
	const booking = await BookingRepository.getInstance().createBooking(
		request.body.seats,
		request.body.customerId,
	);

	const [route] = await db
		.select({
			pricing: routes.pricing,
		})
		.from(routes)
		.innerJoin(journeys, eq(journeys.routeId, routes.id))
		.innerJoin(seats, eq(seats.journeyId, journeys.id))
		.innerJoin(tickets, eq(tickets.seatId, seats.id))
		.where(eq(tickets.bookingId, booking));

	const pricing = route.pricing as any as Record<SeatClass, string>;

	const bookedSeats = await db
		.select({
			class: seats.class,
		})
		.from(seats)
		.innerJoin(tickets, eq(tickets.seatId, seats.id))
		.where(eq(tickets.bookingId, booking));

	let premium = 0;
	let standard = 0;

	for (const s of bookedSeats) {
		if (s.class === seatClass.premium) {
			premium += 1;
		} else {
			standard += 1;
		}
	}

	let successCallbackUrl: string | undefined;
	if (request.body.successURL) {
		const url = new URL(request.body.successURL);
		if (url.pathname.endsWith("/")) {
			url.pathname = url.pathname.slice(0, -1);
		}

		url.pathname += `/${booking}`;
		successCallbackUrl = url.toString();
	}

	const session = await this.stripe.checkout.sessions.create({
		mode: "payment",
		cancel_url: request.body.cancelURL, // Maybe just return URL?
		success_url: successCallbackUrl,
		metadata: {
			bookingId: booking,
		},
		line_items: [
			{
				price: pricing[seatClass.premium],
				quantity: premium,
			},
			{
				price: pricing[seatClass.standard],
				quantity: standard,
			},
		],
	});

	if (session.url === null) {
		throw new Error("Session URL is null");
	}

	return { url: session.url };
};
