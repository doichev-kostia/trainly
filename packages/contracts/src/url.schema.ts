import { z } from "zod";

export const UrlSchema = z.object({
	url: z.string(),
});

export type Url = z.infer<typeof UrlSchema>;
