import { z, type ZodType, type ZodTypeDef } from "zod";
import { TrainResponseSchema } from "../trains/train-response.schema.js";
import { JourneyResponseSchema } from "../journeys/journey-response.schema.js";
import { StopResponseSchema } from "../stops/stop-response.schema.js";

export const RouteSchema = z.object({
	id: z.string(),
	name: z.string(),
	pricing: z.unknown(),
	trainId: z.string(),
});

export type RouteResponse = z.infer<typeof RouteSchema> & {
	train?: z.infer<typeof TrainResponseSchema>;
	journeys?: z.infer<typeof JourneyResponseSchema>[];
	stops?: z.infer<typeof StopResponseSchema>[];
};

export const RouteResponseSchema: ZodType<RouteResponse, ZodTypeDef, unknown> = RouteSchema.extend({
	train: z.lazy(() => TrainResponseSchema.optional()),
	journeys: z.lazy(() => z.array(JourneyResponseSchema).optional()),
	stops: z.lazy(() => z.array(StopResponseSchema).optional()),
});
