import { z } from "zod";
import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { CustomerExpansionSchema } from "./customer-expansion.schema.js";

export const ListCustomerQuerySchema = PaginationQuerySchema.extend({
	email: z.string().optional(),
	expand: CustomerExpansionSchema.array().optional(),
});

export type ListCustomerQuery = z.infer<typeof ListCustomerQuerySchema>;
