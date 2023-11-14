import { z, type ZodType, type ZodTypeDef } from "zod";
import { isoDate } from "../utils.js";
import { BookingResponseSchema } from "../bookings/booking-response.schema.js";
import { PassengerResponseSchema } from "../passengers/passenger-response.schema.js";
import { SeatResponseSchema } from "../seats/seat-response.schema.js";

export const TicketSchema = z.object({
	id: z.string(),
	createdAt: isoDate,
	passengerId: z.string(),
	seatId: z.string(),
	bookingId: z.string(),
});

export type Ticket = z.infer<typeof TicketSchema>;

export type TicketResponse = z.infer<typeof TicketSchema> & {
	booking?: z.infer<typeof BookingResponseSchema>;
	passenger?: z.infer<typeof PassengerResponseSchema>;
	seat?: z.infer<typeof SeatResponseSchema>;
};

export const TicketResponseSchema: ZodType<TicketResponse, ZodTypeDef, unknown> =
	TicketSchema.extend({
		booking: z.lazy(() => BookingResponseSchema.optional()),
		passenger: z.lazy(() => PassengerResponseSchema.optional()),
		seat: z.lazy(() => SeatResponseSchema.optional()),
	});
