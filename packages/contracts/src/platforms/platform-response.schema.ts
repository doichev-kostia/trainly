import { z, type ZodType, type ZodTypeDef } from "zod";
import { StationResponseSchema } from "../stations/station-response.schema.js";
import { isoDate } from "../utils.js";
import { JourneyStopResponseSchema } from "../journey-stops/journey-stop-response.schema.js";
import { StopResponseSchema } from "../stops/stop-response.schema.js";

export const PlatformSchema = z.object({
	id: z.string().uuid(),
	createdAt: isoDate,
	updatedAt: isoDate,
	name: z.string(),
	stationId: z.string().uuid(),
});

export type PlatformResponse = z.infer<typeof PlatformSchema> & {
	station?: z.infer<typeof StationResponseSchema>;
	stops?: z.infer<typeof StopResponseSchema>[];
	journeyStops?: z.infer<typeof JourneyStopResponseSchema>[];
};

export const PlatformResponseSchema: ZodType<PlatformResponse, ZodTypeDef, unknown> =
	PlatformSchema.extend({
		station: z.lazy(() => StationResponseSchema.optional()),
		stops: z.lazy(() => z.array(StopResponseSchema).optional()),
		journeyStops: z.lazy(() => z.array(JourneyStopResponseSchema).optional()),
	});
