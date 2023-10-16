export type ValueOf<T> = T[keyof T];

export function castToEnum<T extends object, V = T[keyof T]>(object: T) {
	return Object.freeze(Object.values(object)) as Readonly<[V, ...V[]]>;
}
