import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { ExpansionQuerySchema } from "../expansion-query.schema.js";
import { z } from "zod";
import { toDate } from "../utils.js";

export const ListJourneysQuerySchema = PaginationQuerySchema.merge(ExpansionQuerySchema).extend({
	departure: z.string().min(2),
	arrival: z.string().min(2),
	date: z.preprocess(toDate, z.date()),
	minSeats: z.coerce.number().int().positive(),
});

export type ListJourneysQuery = z.infer<typeof ListJourneysQuerySchema>;
