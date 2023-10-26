import { z } from "zod";
import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { castToArray } from "../utlls.js";
import { StationExpansionSchema } from "./station-expansion.schema.js";

export const ListStationQuerySchema = PaginationQuerySchema.extend({
	name: z.string().optional(),
	expand: z.preprocess(castToArray, StationExpansionSchema.array().optional()),
});

export type ListStationQuery = z.infer<typeof ListStationQuerySchema>;
