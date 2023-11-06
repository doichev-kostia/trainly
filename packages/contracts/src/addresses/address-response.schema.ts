import { z, type ZodType, type ZodTypeDef } from "zod";
import { isoDate } from "../utils.js";
import { StationResponseSchema } from "../stations/station-response.schema.js";

export const AddressSchema = z.object({
	id: z.string().uuid(),
	createdAt: isoDate,
	country: z.string(),
	city: z.string(),
	line1: z.string(),
	line2: z.string().nullable(),
	postalCode: z.string(),
	state: z.string().nullable(),
	stationId: z.string(),
});

export type AddressResponse = z.infer<typeof AddressSchema> & {
	station?: z.infer<typeof StationResponseSchema>;
};

export const AddressResponseSchema: ZodType<AddressResponse, ZodTypeDef, unknown> =
	AddressSchema.extend({
		station: z.lazy(() => StationResponseSchema.optional()),
	});
