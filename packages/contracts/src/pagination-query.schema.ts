import { z } from "zod";

export const PaginationQuerySchema = z.object({
	limit: z.coerce.number().int().positive().default(10).optional(),
	offset: z.coerce.number().int().min(0).default(0).optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
