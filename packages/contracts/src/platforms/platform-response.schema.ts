import { z } from "zod";
import { StationResponseSchema } from "../stations/station-response.schema.js";

export const PlatformResponseSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	name: z.string(),
	stationId: z.string().uuid(),
	station: StationResponseSchema.optional(),
});

export type PlatformResponse = z.infer<typeof PlatformResponseSchema>;
