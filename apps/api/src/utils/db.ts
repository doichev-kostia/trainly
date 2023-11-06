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

/**
 * Transforms an array of relations into a tree structure needed for the ORM.
 * @example ['journey', 'route.train'] => { journey: true, route: { with: { train: true } }}
 * @param expansion
 */
export function relations(
	expansion: string[],
): Record<string, true | { with: Record<string, true> }> {
	const result: Record<string, true | { with: Record<string, true> }> = {};

	for (const relation of expansion) {
		const keys = relation.split(".");
		const last = keys.pop() as string;
		let current = result;
		for (const key of keys) {
			if (!current[key] || typeof current[key] === "boolean") {
				current[key] = { with: {} };
			}

			current = (current[key] as { with: Record<string, true> }).with;
		}
		current[last] = true;
	}

	return result;
}

export type Pagination = {
	limit?: number;
	offset?: number;
};

export type Expansion = string[];

export type ListOptions = {
	pagination?: Pagination;
	expansion?: Expansion;
};
