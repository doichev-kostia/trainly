import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { ExpansionQuerySchema } from "../expansion-query.schema.js";
import { z } from "zod";
import { castToArray } from "../utils.js";

export const ListSeatsQuerySchema = PaginationQuerySchema.merge(ExpansionQuerySchema).extend({
	journeyId: z.string(),
	ids: z.preprocess(castToArray, z.string().array()).optional(),
});

export type ListSeatsQuery = z.infer<typeof ListSeatsQuerySchema>;
