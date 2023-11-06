import { z, type ZodType, type ZodTypeDef } from "zod";
import { isoDate } from "../utils.js";
import { JourneyResponseSchema } from "../journeys/journey-response.schema.js";
import { PlatformResponseSchema } from "../platforms/platform-response.schema.js";
import { StopResponseSchema } from "../stops/stop-response.schema.js";

export const JourneyStopSchema = z.object({
	id: z.string(),
	expectedArrival: isoDate,
	actualArrival: isoDate.nullable(),
	journeyId: z.string(),
	stopId: z.string(),
	platformId: z.string().nullable(),
});

export type JourneyStop = z.infer<typeof JourneyStopSchema>;

export type JourneyStopResponse = JourneyStop & {
	journey?: z.infer<typeof JourneyResponseSchema>;
	stop?: z.infer<typeof StopResponseSchema>;
	platform?: z.infer<typeof PlatformResponseSchema> | null;
};

export const JourneyStopResponseSchema: ZodType<JourneyStopResponse, ZodTypeDef, unknown> =
	JourneyStopSchema.extend({
		journey: z.lazy(() => JourneyResponseSchema.optional()),
		stop: z.lazy(() => StopResponseSchema.optional()),
		platform: z.lazy(() => PlatformResponseSchema.nullish()),
	});
