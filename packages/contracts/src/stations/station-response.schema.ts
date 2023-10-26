import { z } from "zod";
import { AddressResponseSchema } from "../addresses/address-response.schema.js";

export const StationResponseSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	name: z.string(),
	address: AddressResponseSchema.optional(),
});

export type StationResponse = z.infer<typeof StationResponseSchema>;
