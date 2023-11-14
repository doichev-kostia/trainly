import { type Handler } from "~/utils/types.js";
import { type ExpansionQuerySchema, type IdParamsSchema } from "@trainly/contracts";
import { BookingRepository } from "~/routes/v1/checkout/booking.repository.js";
import { type BookingResponseSchema } from "@trainly/contracts/bookings";

type Schema = {
	params: typeof IdParamsSchema;
	querystring: typeof ExpansionQuerySchema;
	response: {
		"2xx": typeof BookingResponseSchema;
	};
};

export const retrieveBooking: Handler<Schema> = async function retrieveBooking(request) {
	const booking = await BookingRepository.getInstance().retrieve(
		request.params.id,
		request.query.expand,
	);

	if (!booking) {
		throw this.httpErrors.notFound("Booking not found");
	}

	return booking as any;
};
