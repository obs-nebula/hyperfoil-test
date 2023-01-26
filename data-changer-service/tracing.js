const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { NodeTracerProvider, SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { FastifyInstrumentation } = require('@opentelemetry/instrumentation-fastify');

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.npm_package_name
});

const provider = new NodeTracerProvider({ resource: resource });

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyInstrumentation()
  ],
  tracerProvider: provider
});
