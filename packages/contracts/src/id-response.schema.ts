import { z } from "zod";

export const IdResponseSchema = z.object({
	id: z.string(),
});

export type IdResponse = z.infer<typeof IdResponseSchema>;
