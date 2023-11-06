import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { ExpansionQuerySchema } from "../expansion-query.schema.js";
import { z } from "zod";

export const ListSeatsQuerySchema = PaginationQuerySchema.merge(ExpansionQuerySchema).extend({
	journeyId: z.string(),
});

export type ListSeatsQuery = z.infer<typeof ListSeatsQuerySchema>;
