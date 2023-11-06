import { z, type ZodType, type ZodTypeDef } from "zod";
import { RouteResponseSchema } from "../routes/route-response.schema.js";
import { PlatformResponseSchema } from "../platforms/platform-response.schema.js";
import { JourneyStopResponseSchema } from "../journey-stops/journey-stop-response.schema.js";

export const StopSchema = z.object({
	id: z.string(),
	durationFromPrevious: z.number().int(), // in seconds
	order: z.number().int(),
	routeId: z.string(),
	platformId: z.string().nullable(),
});

export type StopResponse = z.infer<typeof StopSchema> & {
	route?: z.infer<typeof RouteResponseSchema>;
	platform?: z.infer<typeof PlatformResponseSchema>;
	journeyStops?: z.infer<typeof JourneyStopResponseSchema>[];
};

export const StopResponseSchema: ZodType<StopResponse, ZodTypeDef, unknown> = StopSchema.extend({
	route: z.lazy(() => RouteResponseSchema.optional()),
	platform: z.lazy(() => PlatformResponseSchema.optional()),
	journeyStops: z.lazy(() => z.array(JourneyStopResponseSchema).optional()),
});
