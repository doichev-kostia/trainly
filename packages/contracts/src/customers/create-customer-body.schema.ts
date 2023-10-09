import { z } from "zod";

export const CreateCustomerBodySchema = z.object({
	firstName: z.string().min(2).max(255),
	lastName: z.string().min(2).max(255),
	email: z.string().email(),
});

export type CreateCustomerBody = z.infer<typeof CreateCustomerBodySchema>;
