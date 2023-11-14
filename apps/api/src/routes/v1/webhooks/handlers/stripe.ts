import { type Handler } from "~/utils/types.js";
import { Option as O } from "effect";
import { type Stripe } from "stripe";
import { db, eq, inArray } from "@trainly/db";
import { bookings } from "@trainly/db/schema/bookings";
import { bookingStatus, seatStatus } from "@trainly/db/schema/enums";
import { seats } from "@trainly/db/schema/seats";
import { tickets } from "@trainly/db/schema/tickets";

export const stripeHandler: Handler<any> = async function stripeHanlder(request, reply) {
	const event = this.parseStripeEvent(request);

	if (O.isNone(event)) {
		request.log.error("Invalid Stripe Event");
		reply.status(this.httpStatus.BAD_REQUEST);
		return;
	}

	if (event.value.type !== "checkout.session.completed") {
		return reply.status(this.httpStatus.OK);
	}

	const payload = event.value.object as any as Stripe.Checkout.Session;

	const metadata = payload.metadata as { bookingId: string };
	// update booking and seats

	if (payload.payment_status === "paid") {
		const [{ id }] = await db
			.update(bookings)
			.set({
				status: bookingStatus.paid,
			})
			.where(eq(bookings.id, metadata.bookingId))
			.returning({ id: bookings.id });

		const bookingSeats = await db
			.select({
				id: seats.id,
			})
			.from(seats)
			.innerJoin(tickets, eq(tickets.seatId, seats.id))
			.where(eq(tickets.bookingId, metadata.bookingId));

		const ids = bookingSeats.map((seat) => seat.id);

		if (ids.length > 0) {
			await db
				.update(seats)
				.set({
					status: seatStatus.booked,
				})
				.where(inArray(seats.id, ids))
				.returning({ id: seats.id });
		}

		// send email
	}
};
