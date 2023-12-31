import * as S from "@effect/schema/Schema";
import { type Milliseconds } from "~/utils/types.js";
import { milliseconds } from "~/constants.js";

export const ConfigSchema = S.struct({
	secrets: S.struct({
		manager: S.literal("gcp", "local"),
		name: S.string,
	}),
	fastify: S.struct({
		graceCloseDelay: S.optional(S.number.pipe(S.brand("Milliseconds"))).withDefault(
			() => (2 * milliseconds.second) as Milliseconds,
		),
	}),
	logger: S.struct({
		level: S.optional(S.string).withDefault(() => "info"),
		prettyPrint: S.optional(S.boolean).withDefault(() => false),
	}),
	swagger: S.struct({
		enabled: S.optional(S.boolean).withDefault(() => false),
	}),
	telemetry: S.union(
		S.struct({
			enabled: S.literal(false),
		}),
		S.struct({
			enabled: S.literal(true),
			serviceName: S.string.pipe(S.nonEmpty<string>()),
			serviceVersion: S.string.pipe(S.nonEmpty<string>()),
			tracing: S.literal("gcp", "jaeger"),
			metrics: S.literal("gcp", "prometheus"),
			tracingOptions: S.optional(
				S.struct({
					url: S.optional(S.string),
				}),
			),
			metricsOptions: S.optional(
				S.struct({
					port: S.optional(S.number),
					endpoint: S.optional(S.string),
				}),
			),
			disabledInstrumentation: S.optional(S.array(S.string)).withDefault(() => []),
		}),
	),

	// Services configuration to avoid the dependency on process.env
	services: S.struct({
		error: S.struct({
			implementation: S.literal("sentry", "local"),
		}),
		payment: S.struct({
			implementation: S.literal("stripe", "mock"),
		}),
		secrets: S.struct({
			implementation: S.literal("gcp", "local"),
		}),
		email: S.struct({
			implementation: S.literal("resend", "mock"),
			from: S.string.pipe(S.nonEmpty<string>()),
		}),
	}),
	miscellaneous: S.struct({
		frontendURL: S.string.pipe(S.nonEmpty<string>()),
		host: S.optional(S.string),
	}),
});

export type Config = S.Schema.To<typeof ConfigSchema>;
