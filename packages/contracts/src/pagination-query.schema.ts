import { z } from "zod";

export const PaginationQuerySchema = z.object({
	limit: z.number().int().positive().default(10),
	offset: z.number().int().positive().default(0),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
