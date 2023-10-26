import { z } from "zod";
import { CreateAddressBodySchema } from "../addresses/create-address-body.schema.js";

export const CreateStationBodySchema = z.object({
	name: z.string().min(1).max(255),
	address: CreateAddressBodySchema,
});

export type CreateStationBody = z.infer<typeof CreateStationBodySchema>;
