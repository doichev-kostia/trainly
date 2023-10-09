import { CreateCustomerBodySchema } from "./create-customer-body.schema.js";
import { type z } from "zod";

export const UpdateCustomerBodySchema = CreateCustomerBodySchema.partial();

export type UpdateCustomerBody = z.infer<typeof UpdateCustomerBodySchema>;
