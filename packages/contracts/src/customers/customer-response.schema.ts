import { z } from "zod";

export const CustomerResponseSchema = z.object({
	id: z.string().uuid(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
});

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;
