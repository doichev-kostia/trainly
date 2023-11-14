import { z } from "zod";
import { BookingResponseSchema } from "../bookings/booking-response.schema.js";

export const CustomerSchema = z.object({
	id: z.string().uuid(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export type CustomerResponse = z.infer<typeof CustomerSchema> & {
	bookings?: z.infer<typeof BookingResponseSchema>[];
};

export const CustomerResponseSchema = CustomerSchema.extend({
	bookings: z.lazy(() => z.array(BookingResponseSchema).optional()),
});
