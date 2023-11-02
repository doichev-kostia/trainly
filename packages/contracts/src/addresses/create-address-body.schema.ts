import { z } from "zod";

export const CreateAddressBodySchema = z.object({
	country: z.string().min(1),
	city: z.string().min(1),
	line1: z.string().min(1),
	line2: z.string().optional(),
	postalCode: z.string().min(1),
	state: z.string().optional(),
});

export type CreateAddressBody = z.infer<typeof CreateAddressBodySchema>;
