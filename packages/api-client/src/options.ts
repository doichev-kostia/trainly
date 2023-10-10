import { type Options as KyOptions } from "ky";
import * as querystring from "querystring";
import { type ParsedUrlQueryInput } from "querystring";

export type Options = Omit<KyOptions, "searchParams"> & {
	searchParams?: ParsedUrlQueryInput;
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
		opts.searchParams = new URLSearchParams(querystring.stringify(options.searchParams));
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
