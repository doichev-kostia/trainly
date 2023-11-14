import { z } from "zod";

export const CreateBookingBodySchema = z.object({
	customerId: z.string().optional(),
	successURL: z.string().optional(), // will be used to redirect the user to the success page, with /:bookingId
	cancelURL: z.string().optional(), // will be used to redirect the user to the cancel page
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
