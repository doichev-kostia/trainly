import * as S from "@effect/schema/Schema";
import { IntQuerySchema, TimestampSchema } from "~/schemas.js";
export const ListStationsQuerySchema = S.struct({
	pageSize: S.optional(IntQuerySchema),
	pageToken: S.optional(S.string),
});

export type ListStationsQuery = S.Schema.To<typeof ListStationsQuerySchema>;

export const AddressSchema = S.struct({
	id: S.string,
	country: S.string,
	city: S.string,
	line1: S.string,
	line2: S.nullable(S.string),
	postalCode: S.string,
	state: S.nullable(S.string),
});

export type Address = S.Schema.To<typeof AddressSchema>;

export const StationSchema = S.struct({
	id: S.string,
	name: S.string,
	address: AddressSchema,
});

export type Station = S.Schema.To<typeof StationSchema>;

export const ListStationsResponseSchema = S.struct({
	stations: S.array(StationSchema),
	nextPageToken: S.string,
});

export type ListStationsResponse = S.Schema.To<typeof ListStationsResponseSchema>;
