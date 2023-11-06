import { type Options as KyOptions } from "ky";
import * as querystring from "querystring";
import { type ParsedUrlQueryInput } from "querystring";

export type Options = Omit<KyOptions, "searchParams"> & {
	searchParams?: Record<
		string,
		| string
		| number
		| boolean
		| Date
		| ReadonlyArray<string>
		| ReadonlyArray<number>
		| ReadonlyArray<boolean>
		| ReadonlyArray<Date>
		| null
	>;
};

export type RequestOptions = {
	apiKey?: string;
};

type KyHeadersInit = HeadersInit | Record<string, string | undefined>;

export function processOptions(
	options: Options = {},
	requestOptions: RequestOptions = {},
): KyOptions {
	const opts: KyOptions = options as KyOptions;

	if (options.searchParams) {
		const params = { ...options.searchParams };
		for (const key in params) {
			const value = params[key as keyof typeof params];
			if (value instanceof Date) {
				// @ts-ignore
				params[key] = value.toISOString();
			} else if (Array.isArray(value)) {
				for (let i = 0; i < value.length; i++) {
					const item = value[i];
					if (item instanceof Date) {
						// @ts-ignore
						value[i] = item.toISOString();
					}
				}
			}
		}

		opts.searchParams = new URLSearchParams(
			querystring.stringify(params as ParsedUrlQueryInput),
		);
	}

	if (!options.headers) {
		opts.headers = new Headers();
	} else {
		opts.headers = normalizeHeaders(options.headers);
	}

	if (requestOptions?.apiKey) {
		opts.headers.set("Authorization", `Bearer ${requestOptions.apiKey}`);
	}

	return opts;
}

function normalizeHeaders(headers: KyHeadersInit): Headers {
	if (headers instanceof Headers) {
		return headers;
	} else if (Array.isArray(headers)) {
		return new Headers(headers);
	} else if (typeof headers === "object") {
		const h = new Headers();
		for (const key in headers) {
			const value = headers[key];
			if (value != undefined) {
				h.set(key, value);
			}
		}
		return h;
	} else {
		return new Headers(headers);
	}
}
