import { type Attributes } from "@opentelemetry/api";

export function toOpenTelemetryAttributes(value: Record<string, unknown>): Attributes {
	const attributes: Attributes = {};

	for (const key of Object.keys(value)) {
		const v = value[key];
		if (typeof v === "string") {
			attributes[key] = v;
		} else if (typeof v === "number") {
			attributes[key] = v;
		} else if (typeof v === "boolean") {
			attributes[key] = v;
		} else if (v == null) {
			attributes[key] = undefined;
		} else if (typeof v === "object") {
			attributes[key] = saveJSON(v);
		}
	}

	return attributes;
}

const saveJSON = (value: unknown): string | undefined => {
	try {
		return JSON.stringify(value);
	} catch (error) {
		return undefined;
	}
};
