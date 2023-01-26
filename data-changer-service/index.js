const fastify = require('fastify')();
const { Kafka } = require('kafkajs');

const opentelemetry = require('@opentelemetry/api');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

const kafka = new Kafka({
  clientId: 'data-changer-service',
  brokers: ['kafka:9092']
});

const span = opentelemetry.trace.getTracer('default').startSpan('new producer');
const producer = kafka.producer();
span.end();

function changeMessage(msg) {
  const newMsg = msg.split(' ').filter(token => {
    return token.length < 8;
  }).join(' ');
  return newMsg;
}

fastify.post('/', async (request, reply) => {
  const newMessage = changeMessage(request.body.msg);
  const span = opentelemetry.trace.getTracer('default').startSpan('producer connect');
  await producer.connect();
  span.end();
  try {
    const span2 = opentelemetry.trace.getTracer('default').startSpan('producer send');
    await producer.send({
      topic: 'msgs',
      messages: [{ value: newMessage }]
    });
    span2.end();
  } catch (err) {
    console.log(err);
  }
  reply.send(newMessage);
});

fastify.get('/', (_, reply) => {
  reply.send('ok');
});

fastify.listen({ host: '0.0.0.0', port: 8081 }, (err, _) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});