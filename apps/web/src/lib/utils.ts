function update(data, keys, value) {
	if (keys.length === 0) {
		// Leaf node
		return value;
	}

	let key = keys.shift();
	if (!key) {
		data = data || [];
		if (Array.isArray(data)) {
			key = data.length;
		}
	}

	// Try converting key to a numeric value
	const index = +key;
	if (!isNaN(index)) {
		// We have a numeric index, make data a numeric array
		// This will not work if this is a associative array
		// with numeric keys
		data = data || [];
		key = index;
	}

	// If none of the above matched, we have an associative array
	data = data || {};

	const val = update(data[key], keys, value);
	data[key] = val;

	return data;
}
/**
 * Transforms a FormData object into a plain object
 * @example ["name", "John Doe"] => { name: "John Doe" }; ["contact[phone]", "1234567890"] => { contact: { phone: "1234567890" } }
 * @param data
 */
/* eslint-disable */
export function transformFormDataToObject(formData: FormData): unknown {
	return Array.from(formData.entries()).reduce((data, [field, value]) => {
		// @ts-ignore
		let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);

		if (keys) {
			keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), (m) => m[1]);
			// @ts-ignore
			value = update(data[prefix], keys, value);
		}
		// @ts-ignore
		data[prefix] = value;
		return data;
	}, {});
}
/* eslint-enable */
