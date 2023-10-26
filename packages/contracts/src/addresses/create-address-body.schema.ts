import { z } from "zod";

export const CreateAddressBodySchema = z.object({
	country: z.string().min(1),
	city: z.string().min(1),
	street: z.string().min(1),
	streetNumber: z.string().min(1),
	index: z.string().min(1),
});

export type CreateAddressBody = z.infer<typeof CreateAddressBodySchema>;
