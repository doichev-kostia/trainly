import {
	type FastifyBaseLogger,
	type FastifyInstance,
	type FastifyPluginAsync,
	type FastifyPluginOptions,
	type FastifyReply,
	type FastifyRequest,
	type RawReplyDefaultExpression,
	type RawServerBase,
	type RawServerDefault,
	type RouteHandlerMethod,
} from "fastify";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { type RouteGenericInterface } from "fastify/types/route.js";
import {
	type ContextConfigDefault,
	type RawRequestDefaultExpression,
} from "fastify/types/utils.js";
import { type FastifySchema } from "fastify/types/schema.js";
import { type ResolveFastifyReplyReturnType } from "fastify/types/type-provider.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

export type Plugin<
	Options extends FastifyPluginOptions = Record<never, never>,
	Server extends RawServerBase = RawServerDefault,
> = FastifyPluginAsync<Options, Server, ZodTypeProvider>;

export type Instance = FastifyInstance<
	RawServerDefault,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

export type HandlerRequest<Schema extends FastifySchema> = FastifyRequest<
	RouteGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	Schema,
	ZodTypeProvider,
	ContextConfigDefault,
	FastifyBaseLogger
>;

export type HandlerReply<Schema extends FastifySchema> = FastifyReply<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	Schema,
	ZodTypeProvider
>;

export type HandlerReturnType<Schema extends FastifySchema> = ResolveFastifyReplyReturnType<
	ZodTypeProvider,
	Schema,
	RouteGenericInterface
>;

export type Handler<Schema extends FastifySchema> = RouteHandlerMethod<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	Schema,
	ZodTypeProvider
>;
