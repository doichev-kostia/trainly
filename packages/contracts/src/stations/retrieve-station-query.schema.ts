import { z } from "zod";
import { castToArray } from "../utlls.js";
import { StationExpansionSchema } from "./station-expansion.schema.js";

export const RetrieveStationQuerySchema = z.object({
	expand: z.preprocess(castToArray, StationExpansionSchema.array().optional()),
});

export type RetrieveStationQuery = z.infer<typeof RetrieveStationQuerySchema>;
