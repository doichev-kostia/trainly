import { z } from "zod";

export const CreateTrainBodySchema = z.object({
	name: z.string().min(1).max(255),
	totalSeats: z.number().int().min(1),
	carriageCapacity: z.number().int().min(1),
	premiumCarriages: z.number().int().min(0),
});

export type CreateTrainBody = z.infer<typeof CreateTrainBodySchema>;
