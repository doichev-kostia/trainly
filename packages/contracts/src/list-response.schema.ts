import { z } from "zod";

export function ListResponseSchema<S extends z.ZodRawShape>(item: S | z.ZodObject<S>) {
	let schema = item;
	if (!(schema instanceof z.ZodSchema)) {
		schema = z.object(schema);
	}

	return z.object({
		items: z.array(schema),
		count: z.number(),
	});
}

export type ListResponse<T> = {
	items: T[];
	count: number;
};
