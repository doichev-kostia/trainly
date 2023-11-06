import { z } from "zod";

export function castToArray<T>(val: T): T extends Array<unknown> ? T : T[] {
	return Array.isArray(val) ? (val as any) : [val];
}
export type ValueOf<T> = T[keyof T];
export function castToEnum<T extends object, V = T[keyof T]>(object: T) {
	return Object.freeze(Object.values(object)) as Readonly<[V, ...V[]]>;
}

export function toDate<T>(value: T): Date | null {
	if (value instanceof Date) {
		return value;
	}

	if (typeof value === "string" || typeof value === "number") {
		return new Date(value);
	}

	return null;
}

export function dateToString(val: unknown): string | null {
	if (!(val instanceof Date)) {
		return null;
	}

	return val.toISOString();
}

export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const isoDate = z.preprocess(dateToString, z.string());
