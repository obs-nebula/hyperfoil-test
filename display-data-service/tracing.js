const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { NodeTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { SocketIoInstrumentation } = require("@opentelemetry/instrumentation-socket.io");
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { HapiInstrumentation } = require('@opentelemetry/instrumentation-hapi');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { OTLPTraceExporter }  = require('@opentelemetry/exporter-trace-otlp-http');

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.npm_package_name
});

const provider = new NodeTracerProvider({ resource: resource });

provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
provider.register();

registerInstrumentations({
  instrumentations: [
    new SocketIoInstrumentation(),
    new PgInstrumentation(),
    new HttpInstrumentation(),
    new HapiInstrumentation()
  ],
  tracerProvider: provider
});
