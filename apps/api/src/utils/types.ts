import {
	type FastifyBaseLogger,
	type FastifyInstance,
	type RawReplyDefaultExpression,
	type RawServerDefault,
	type RouteHandlerMethod,
} from "fastify";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { type RouteGenericInterface } from "fastify/types/route.js";
import { type ContextConfigDefault, type RawRequestDefaultExpression } from "fastify/types/utils.js";
import { type FastifySchema } from "fastify/types/schema.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import type * as B from "effect/Brand";
import type * as S from "@effect/schema/Schema";

export type Instance = FastifyInstance<
	RawServerDefault,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

export type Seconds = number & B.Brand<"Seconds">;
export type Milliseconds = number & B.Brand<"Milliseconds">;

type HandlerSchema = {
	body?: unknown;
	querystring?: unknown;
	params?: unknown;
	headers?: unknown;
	response?: unknown;
};

// if there is something defined in the Handler Schema -> transform it to a Effect Schema
// else ?: unknown
type ToFastifySchema<Schema extends HandlerSchema> = FastifySchema & {
	[P in keyof Schema]: S.Schema<Schema[P]>;
} & {
	[P in Exclude<keyof HandlerSchema, keyof Schema>]?: unknown;
};

// export type Handler<Schema extends HandlerSchema> = RouteHandlerMethod<
// 	RawServerDefault,
// 	RawRequestDefaultExpression<RawServerDefault>,
// 	RawReplyDefaultExpression<RawServerDefault>,
// 	RouteGenericInterface,
// 	ContextConfigDefault,
// 	ToFastifySchema<Schema>,
// 	EffectTypeProvider
// >;

export type Handler<Schema extends FastifySchema> = RouteHandlerMethod<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	Schema,
	ZodTypeProvider
>;
