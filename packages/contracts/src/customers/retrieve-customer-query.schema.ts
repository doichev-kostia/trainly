import { z } from "zod";
import { CustomerExpansionSchema } from "./customer-expansion.schema.js";
import { castToArray } from "../utlls.js";

export const RetrieveCustomerQuerySchema = z.object({
	expand: z.preprocess(castToArray, CustomerExpansionSchema.array().optional()),
});

export type RetrieveCustomerQuery = z.infer<typeof RetrieveCustomerQuerySchema>;
