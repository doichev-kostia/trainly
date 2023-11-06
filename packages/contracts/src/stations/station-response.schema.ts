import { z, type ZodType, type ZodTypeDef } from "zod";
import { AddressResponseSchema } from "../addresses/address-response.schema.js";
import { isoDate } from "../utils.js";
import { PlatformResponseSchema } from "../platforms/platform-response.schema.js";

export const StationSchema = z.object({
	id: z.string().uuid(),
	createdAt: isoDate,
	name: z.string(),
});

export type StationResponse = z.infer<typeof StationSchema> & {
	address?: z.infer<typeof AddressResponseSchema>;
	platforms?: z.infer<typeof PlatformResponseSchema>[];
};

export const StationResponseSchema: ZodType<StationResponse, ZodTypeDef, unknown> =
	StationSchema.extend({
		address: z.lazy(() => AddressResponseSchema.optional()),
		platforms: z.lazy(() => z.array(PlatformResponseSchema).optional()),
	});
