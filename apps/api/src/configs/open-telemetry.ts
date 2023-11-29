import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { type InstrumentationConfig } from "@opentelemetry/instrumentation";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { type FastifyRequestInfo } from "@opentelemetry/instrumentation-fastify";
import { type Span } from "@opentelemetry/api";

import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

import { GcpDetectorSync } from "@google-cloud/opentelemetry-resource-util";
import { MetricExporter } from "@google-cloud/opentelemetry-cloud-monitoring-exporter";
import { TraceExporter } from "@google-cloud/opentelemetry-cloud-trace-exporter";

import { match } from "ts-pattern";

import { milliseconds } from "~/constants.js";
import { config } from "~/configs/config.js";
import { env } from "~/configs/env.js";
import { type Config } from "~/configs/schemas/config.schema.js";

type GcpAuth = {
	projectId: string;
	keyFilename: string;
};

const IGNORED_PATHS = ["/metrics", "/health"];

((config: Config["telemetry"], gcpAuth: GcpAuth) => {
	if (config.enabled === false) {
		return;
	}

	const traceExporter = match(config.tracing)
		.with("gcp", () => new TraceExporter(gcpAuth))
		.with("jaeger", () => new OTLPTraceExporter(config.tracingOptions))
		.exhaustive();

	const metricReader = match(config.metrics)
		.with(
			"gcp",
			() =>
				new PeriodicExportingMetricReader({
					exportIntervalMillis: 30 * milliseconds.second,
					exporter: new MetricExporter(gcpAuth),
				}),
		)
		.with("prometheus", () => {
			return new PrometheusExporter(config.metricsOptions);
		})
		.exhaustive();

	const resource = new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
		[SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion,
	}).merge(new GcpDetectorSync().detect());

	const instrumentationOptions: Record<string, InstrumentationConfig> = {};

	config.disabledInstrumentation.forEach((name) => {
		instrumentationOptions[name] = {
			enabled: false,
		};
	});

	const sdk = new NodeSDK({
		resource,
		traceExporter,
		spanProcessor: new BatchSpanProcessor(traceExporter),
		metricReader: metricReader,
		instrumentations: [
			getNodeAutoInstrumentations({
				"@opentelemetry/instrumentation-pino": {
					logHook: (span, record) => {
						span.setAttribute("pino.message", record.msg);
						span.setAttribute("pino.level", record.level);
					},
				},
				"@opentelemetry/instrumentation-fastify": {
					requestHook: function (span: Span, info: FastifyRequestInfo) {
						span.setAttribute("http.method", info.request.method);
					},
				},
				"@opentelemetry/instrumentation-http": {
					ignoreIncomingRequestHook(request) {
						if (!request.url) {
							return true;
						}
						return IGNORED_PATHS.includes(request.url);
					},
				},
				...instrumentationOptions,
			}),
		],
	});

	sdk.start();
})(config.telemetry, {
	projectId: env.GCP_PROJECT_ID,
	keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
});
