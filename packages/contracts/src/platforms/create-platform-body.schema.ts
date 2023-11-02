import { z } from "zod";

export const CreatePlatformBodySchema = z.object({
	name: z.string().min(1),
	stationId: z.string().uuid(),
});

export type CreatePlatformBody = z.infer<typeof CreatePlatformBodySchema>;
