import { z } from "zod";
import { castToArray } from "./utils.js";

export const ExpansionQuerySchema = z.object({
	expand: z.preprocess(castToArray, z.string().array()).optional(),
});

export type ExpansionQuery = z.infer<typeof ExpansionQuerySchema>;
