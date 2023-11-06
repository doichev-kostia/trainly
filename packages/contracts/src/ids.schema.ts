import { z } from "zod";

export const IdsSchema = z.object({
	ids: z.array(z.string()),
});

export type Ids = z.infer<typeof IdsSchema>;
