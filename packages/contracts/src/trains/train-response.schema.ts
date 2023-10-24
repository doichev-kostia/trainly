import { z } from "zod";

export const TrainResponseSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	name: z.string(),
	totalSeats: z.number().int(),
	carriageCapacity: z.number().int(),
	premiumCarriages: z.number().int(),
});

export type TrainResponse = z.infer<typeof TrainResponseSchema>;
