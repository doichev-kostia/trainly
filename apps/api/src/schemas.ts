import * as S from "@effect/schema/Schema";
export const IntQuerySchema = S.transform(
	S.string,
	S.number,
	(x) => parseInt(x),
	(x) => x.toString(),
).pipe(S.int());

export const TimestampSchema = S.Date.pipe(S.brand("Timestamp"));
