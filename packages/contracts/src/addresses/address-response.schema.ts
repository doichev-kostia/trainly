import { z } from "zod";

export const AddressResponseSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	country: z.string(),
	city: z.string(),
	street: z.string(),
	streetNumber: z.string(),
	index: z.string(),
});

export type AddressResponse = z.infer<typeof AddressResponseSchema>;
