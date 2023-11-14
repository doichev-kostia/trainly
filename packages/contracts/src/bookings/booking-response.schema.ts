import { z, type ZodType, type ZodTypeDef } from "zod";
import { isoDate } from "../utils.js";
import { bookingStatusSchema } from "./enums.js";
import { TicketResponseSchema } from "../tickets/ticket-response.schema.js";
import { CustomerResponseSchema } from "../customers/customer-response.schema.js";

export const BookingSchema = z.object({
	id: z.string(),
	createdAt: isoDate,
	status: bookingStatusSchema,
	email: z.string().email(),
	customerId: z.string().nullish(),
});

export type Booking = z.infer<typeof BookingSchema>;

export type BookingResponse = z.infer<typeof BookingSchema> & {
	tickets?: z.infer<typeof TicketResponseSchema>[];
	customer?: z.infer<typeof CustomerResponseSchema>;
};

export const BookingResponseSchema: ZodType<BookingResponse, ZodTypeDef, unknown> =
	BookingSchema.extend({
		tickets: z.lazy(() => z.array(TicketResponseSchema).optional()),
		customer: z.lazy(() => CustomerResponseSchema.optional()),
	});
