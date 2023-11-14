import { z, type ZodType, type ZodTypeDef } from "zod";
import { RouteResponseSchema } from "../routes/route-response.schema.js";
import { isoDate } from "../utils.js";
import { JourneyStopResponseSchema } from "../journey-stops/journey-stop-response.schema.js";
import { type SeatResponseSchema } from "../seats/seat-response.schema.js";

export const JourneySchema = z.object({
	id: z.string(),
	departureTime: isoDate,
	delay: z.number().int(),
	routeId: z.string(),
});

export type Journey = z.infer<typeof JourneySchema>;

export type JourneyResponse = z.infer<typeof JourneySchema> & {
	route?: z.infer<typeof RouteResponseSchema>;
	journeyStops?: z.infer<typeof JourneyStopResponseSchema>[];
	seats?: z.infer<typeof SeatResponseSchema>[];
};

export const JourneyResponseSchema: ZodType<JourneyResponse, ZodTypeDef, unknown> =
	JourneySchema.extend({
		route: z.lazy(() => RouteResponseSchema.optional()),
		journeyStops: z.lazy(() => z.array(JourneyStopResponseSchema).optional()),
		seats: z.lazy(() => z.array(z.any()).optional()),
	});
