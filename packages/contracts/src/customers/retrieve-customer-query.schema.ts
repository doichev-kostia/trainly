import { z } from "zod";
import { CustomerExpansionSchema } from "./customer-expansion.schema.js";

export const RetrieveCustomerQuerySchema = z.object({
	expand: CustomerExpansionSchema.array().optional(),
});

export type RetrieveCustomerQuery = z.infer<typeof RetrieveCustomerQuerySchema>;
