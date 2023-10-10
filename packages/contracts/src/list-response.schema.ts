import { z } from "zod";

export function ListResponseSchema<T extends z.ZodType>(schema: T) {
	return z.object({
		items: z.array(schema),
		count: z.number(),
	});
}

export type ListResponse<T> = {
	items: T[];
	count: number;
};
