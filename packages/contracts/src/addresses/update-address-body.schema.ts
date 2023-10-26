import { CreateAddressBodySchema } from "./create-address-body.schema.js";
import { type z } from "zod";

export const UpdateAddressBodySchema = CreateAddressBodySchema.partial();

export type UpdateAddressBody = z.infer<typeof UpdateAddressBodySchema>;
