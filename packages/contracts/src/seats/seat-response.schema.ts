import { z } from "zod";
import { JourneyResponseSchema } from "../journeys/journey-response.schema.js";

export const SeatSchema = z.object({
	id: z.string(),
	number: z.number().int(),
	class: z.enum(["standard", "premium"]),
	status: z.enum(["available", "reserved", "booked"]),
	journeyId: z.string(),
});

export type SeatResponse = z.infer<typeof SeatSchema> & {
	journey?: z.infer<typeof JourneyResponseSchema>;
	ticket?: unknown;
};

export const SeatResponseSchema = SeatSchema.extend({
	journey: z.lazy(() => JourneyResponseSchema.optional()),
	ticket: z.unknown().nullish(),
});
