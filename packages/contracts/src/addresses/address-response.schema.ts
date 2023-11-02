import { z } from "zod";

export const AddressResponseSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	country: z.string(),
	city: z.string(),
	line1: z.string(),
	line2: z.string().nullable(),
	postalCode: z.string(),
	state: z.string().nullable(),
});

export type AddressResponse = z.infer<typeof AddressResponseSchema>;
