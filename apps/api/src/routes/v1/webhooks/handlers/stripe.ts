import { type ZodHandler } from "~/utils/types.js";
import { Option as O } from "effect";
import { eq, inArray } from "@trainly/db";
import { bookings } from "@trainly/db/schema/bookings";
import { bookingStatus, seatStatus } from "@trainly/db/schema/enums";
import { seats } from "@trainly/db/schema/seats";
import { tickets } from "@trainly/db/schema/tickets";
import { ServiceContainer } from "~/configs/services.js";
import { db } from "~/configs/db.js";
import { type StripeWebhookHeadersSchema } from "~/routes/v1/webhooks/schemas.js";
import { type WebhookEvent } from "~/services/payment/types.js";
import { StatusCodes } from "#constants";
import { BookingConfirmationEmail } from "~/services/email/templates/booking-confirmation-email.js";
import { config } from "~/configs/config.js";

type Schema = {
	headers: typeof StripeWebhookHeadersSchema;
};

export const stripeHandler: ZodHandler<Schema> = async function stripeHanlder(request, reply) {
	const event = request.body as any as WebhookEvent;
	const checkoutEvent = await ServiceContainer.get("payment").prepareCheckoutEvent(event);

	if (O.isNone(checkoutEvent)) {
		return reply.status(StatusCodes.OK);
	}

	const payload = checkoutEvent.value.payload;

	const metadata = payload.metadata;

	if (payload.paymentStatus !== "paid") {
		return reply.status(StatusCodes.OK);
	}

	const [{ id, email }] = await db
		.update(bookings)
		.set({
			status: bookingStatus.paid,
		})
		.where(eq(bookings.id, metadata.bookingId))
		.returning({ id: bookings.id, email: bookings.email });

	const bookingSeats = await db
		.select({
			id: seats.id,
		})
		.from(seats)
		.innerJoin(tickets, eq(tickets.seatId, seats.id))
		.where(eq(tickets.bookingId, id));

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

	const body = new BookingConfirmationEmail({
		url: new URL(`/bookings/${id}`, config.miscellaneous.frontendURL).toString(),
	});

	const html = await body.generate();

	await ServiceContainer.get("email").send(email, "Booking Confirmation", html);
};
