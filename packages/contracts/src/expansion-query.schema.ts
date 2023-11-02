import { z } from "zod";

export const ExpansionQuerySchema = z.object({
	expand: z.string().array().optional(),
});

export type ExpansionQuery = z.infer<typeof ExpansionQuerySchema>;
