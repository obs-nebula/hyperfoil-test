const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { NodeTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { OTLPTraceExporter }  = require('@opentelemetry/exporter-trace-otlp-http');

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.npm_package_name
});

const provider = new NodeTracerProvider({ resource: resource });

provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
provider.register();

registerInstrumentations({
  instrumentations: [
    new PgInstrumentation(),
  ],
  tracerProvider: provider
});
