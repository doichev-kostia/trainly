import { z } from "zod";
import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { ExpansionQuerySchema } from "../expansion-query.schema.js";

export const ListStationQuerySchema = PaginationQuerySchema.merge(ExpansionQuerySchema).extend({
	name: z.string().optional(),
});

export type ListStationQuery = z.infer<typeof ListStationQuerySchema>;
