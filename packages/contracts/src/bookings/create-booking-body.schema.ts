import { z } from "zod";

export const CreateBookingBodySchema = z.object({
	email: z.string().email(),
	customerId: z.string().optional(),
	callbackURL: z.string().optional(), // will be used to redirect the user to the success page, with /:bookingId
	seats: z.array(
		z.object({
			id: z.string(),
			passenger: z.object({
				firstName: z.string(),
				lastName: z.string(),
			}),
		}),
	),
});

export type CreateBookingBody = z.infer<typeof CreateBookingBodySchema>;
