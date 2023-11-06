import { z, type ZodType, type ZodTypeDef } from "zod";
import { isoDate } from "../utils.js";
import { RouteResponseSchema } from "../routes/index.js";

export const TrainSchema = z.object({
	id: z.string().uuid(),
	createdAt: isoDate,
	name: z.string(),
	totalSeats: z.number().int(),
	carriageCapacity: z.number().int(),
	premiumCarriages: z.number().int(),
});

export type TrainResponse = z.infer<typeof TrainSchema> & {
	routes?: z.infer<typeof RouteResponseSchema>[];
};

export const TrainResponseSchema: ZodType<TrainResponse, ZodTypeDef, unknown> = TrainSchema.extend({
	routes: z.lazy(() => z.array(RouteResponseSchema).optional()),
});
