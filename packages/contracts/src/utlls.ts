export function castToArray<T>(val: T): T extends Array<unknown> ? T : T[] {
	return Array.isArray(val) ? (val as any) : [val];
}
