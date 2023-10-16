export function stripValues<T extends object>(object: T) {
	const result: Partial<T> = {};

	for (const key in object) {
		const value = object[key as keyof T];
		if (value !== undefined) {
			result[key as keyof T] = value;
		}
	}

	return result;
}
