import { Either, Option as O } from "effect";

import * as S from "@effect/schema/Schema";
import { filter, type FilterAnnotations, isSchema, type Schema } from "@effect/schema/Schema";
import * as TreeFormatter from "@effect/schema/TreeFormatter";

import { type FastifySchema, type FastifySchemaCompiler, type FastifyTypeProvider } from "fastify";
import { type FastifySerializerCompiler } from "fastify/types/schema.js";
import type * as ReadonlyArray from "effect/ReadonlyArray";
import { type ParseErrors } from "@effect/schema/ParseResult";
import * as AST from "@effect/schema/AST";
import type * as swagger from "@fastify/swagger";
import { JSONSchema } from "@effect/schema";

export const UrlTypeId = Symbol.for("validation/schema/TypeId/Url");

export const url =
	<A extends string>() =>
	<I>(self: Schema<I, A>, options?: FilterAnnotations<A>): Schema<I, A> => {
		return self.pipe(
			filter(
				(a): a is A => {
					try {
						return !!new URL(a);
					} catch (error) {
						return false;
					}
				},
				{
					typeId: UrlTypeId,
					description: `not a valid url`,
					...options,
				},
			),
		);
	};

type AnySchema = Schema<any, any>;

export const validatorCompiler: FastifySchemaCompiler<AnySchema> =
	({ schema }) =>
	(
		data,
	): {
		error?: Error;
		value?: any;
	} => {
		const parser = S.parseEither(schema);
		const parsed = parser(data, {
			errors: "all",
		});

		if (Either.isRight(parsed)) {
			return { value: parsed.right };
		} else {
			return {
				error: new Error(TreeFormatter.formatErrors(parsed.left.errors)),
			};
		}
	};

function hasOwnProperty<T, K extends PropertyKey>(obj: T, prop: K): obj is T & Record<K, any> {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}

function resolveSchema(maybeSchema: AnySchema | { properties: AnySchema }): O.Option<AnySchema> {
	if (hasOwnProperty(maybeSchema, "properties") && S.isSchema(maybeSchema.properties)) {
		return O.some(maybeSchema.properties);
	}

	if (S.isSchema(maybeSchema)) {
		return O.some(maybeSchema);
	}

	return O.none();
}

class ResponseValidationError extends Error {
	public errors: ReadonlyArray.NonEmptyReadonlyArray<ParseErrors>;
	public identifier: string | undefined;

	constructor(errors: ReadonlyArray.NonEmptyReadonlyArray<ParseErrors>, identifier?: string) {
		super("Response doesn't match the schema");
		this.name = "ResponseValidationError";
		this.errors = errors;
		/**
		 * {@link https://github.com/Effect-TS/schema#identifier-annotations | Identifier Annotations}
		 */
		this.identifier = identifier;
	}

	toJSON() {
		return {
			name: this.name,
			errors: TreeFormatter.formatErrors(this.errors),
			identifier: this.identifier,
		};
	}

	toString() {
		if (this.identifier) {
			return `${this.name}: Schema ${this.identifier}; ${TreeFormatter.formatErrors(this.errors)}`;
		}
		return `${this.name}: ${TreeFormatter.formatErrors(this.errors)}`;
	}
}

export const serializerCompiler: FastifySerializerCompiler<AnySchema | { properties: AnySchema }> =
	({ schema: maybeSchema }) =>
	(data) => {
		const schema = resolveSchema(maybeSchema);

		if (O.isNone(schema)) {
			throw new Error("Invalid schema passed");
		}

		const parser = S.parseEither(schema.value);

		const either = parser(data, {
			errors: "all",
		});

		if (Either.isRight(either)) {
			return JSON.stringify(either.right);
		}

		const annotations: AST.Annotations = schema.value.ast.annotations;
		const identifier = annotations[AST.IdentifierAnnotationId] as string | undefined;

		throw new ResponseValidationError(either.left.errors, identifier);
	};

const defaultSkipList = [
	"/documentation/",
	"/documentation/initOAuth",
	"/documentation/json",
	"/documentation/uiConfig",
	"/documentation/yaml",
	"/documentation/*",
	"/documentation/static/*",
	"/docs/",
	"/docs/openapi.json",
	"/docs/openapi.yaml",
	"/docs/*",
];

export function transformToOpenAPI({
	skipList = [],
}: {
	skipList: readonly string[];
}): swagger.FastifyDynamicSwaggerOptions["transform"] {
	skipList = [...defaultSkipList, ...skipList];

	function transform({ schema, url }: { schema: FastifySchema; url: string }): {
		schema: FastifySchema;
		url: string;
	} {
		if (!schema) {
			return {
				schema,
				url,
			};
		}

		const { response, headers, querystring, body, params, hide, ...rest } = schema;

		const transformed: Record<string, any> = {};

		if (skipList.includes(url) || hide) {
			transformed.hide = true;
			return {
				schema: transformed,
				url,
			};
		}

		const schemas: Record<string, any> = {
			headers,
			querystring,
			body,
			params,
		};

		for (const requestPart in schemas) {
			const schema = schemas[requestPart];

			if (schema && isSchema(schema)) {
				transformed[requestPart] = JSONSchema.to(schema);
			}
		}

		if (response) {
			transformed.response = {};

			for (const statusCode in response) {
				const schema = resolveSchema(response[statusCode]);

				if (O.isNone(schema)) {
					transformed.response[statusCode] = response[statusCode];
					continue;
				}

				if (isSchema(schema.value)) {
					transformed.response[statusCode] = JSONSchema.to(schema.value);
				}
			}
		}

		for (const prop in rest) {
			if (rest[prop]) {
				transformed[prop] = rest[prop];
			}
		}

		return {
			schema: transformed,
			url,
		};
	}

	return transform;
}
