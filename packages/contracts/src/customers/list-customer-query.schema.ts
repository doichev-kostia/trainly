import { z } from "zod";
import { PaginationQuerySchema } from "../pagination-query.schema.js";
import { ExpansionQuerySchema } from "../expansion-query.schema.js";

export const ListCustomerQuerySchema = PaginationQuerySchema.merge(ExpansionQuerySchema).extend({
	email: z.string().optional(),
});

export type ListCustomerQuery = z.infer<typeof ListCustomerQuerySchema>;
