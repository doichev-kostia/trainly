import { type ZodHandler } from "~/utils/types.js";
import { type CreateBookingBodySchema } from "@trainly/contracts/bookings";
import { BookingRepository } from "~/routes/v1/checkout/booking.repository.js";
import { eq } from "@trainly/db";
import { routes } from "@trainly/db/schema/routes";
import { journeys } from "@trainly/db/schema/journeys";
import { seats } from "@trainly/db/schema/seats";
import { tickets } from "@trainly/db/schema/tickets";
import { type SeatClass, seatClass } from "@trainly/db/schema/enums";
import { type UrlSchema } from "@trainly/contracts";
import { db } from "~/configs/db.js";
import { ServiceContainer } from "~/configs/services.js";
import { type CheckoutSessionItem } from "~/services/payment/types.js";
import * as O from "effect/Option";

type Schema = {
	body: typeof CreateBookingBodySchema;
	response: {
		"2xx": typeof UrlSchema;
	};
};

export const checkout: ZodHandler<Schema> = async function checkout(request, reply) {
	const booking = await BookingRepository.getInstance().createBooking(
		request.body.seats,
		request.body.email,
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

	let callbackUrl: string | undefined;
	if (request.body.callbackURL) {
		const url = new URL(request.body.callbackURL);
		if (url.pathname.endsWith("/")) {
			url.pathname = url.pathname.slice(0, -1);
		}

		url.pathname += `/${booking}`;
		callbackUrl = url.toString();
	}

	const items: CheckoutSessionItem[] = [];
	if (premium > 0) {
		items.push({
			price: pricing[seatClass.premium],
			quantity: premium,
		});
	} else if (standard > 0) {
		items.push({
			price: pricing[seatClass.standard],
			quantity: standard,
		});
	} else {
		throw this.httpErrors.badRequest("No seats selected");
	}

	const session = await ServiceContainer.get("payment").createCheckoutSession({
		email: request.body.email,
		callbackURL: callbackUrl,
		items,
		metadata: {
			bookingId: booking,
		},
	});

	if (O.isNone(session)) {
		throw this.httpErrors.internalServerError("Failed to create checkout session");
	}

	return session.value;
};
