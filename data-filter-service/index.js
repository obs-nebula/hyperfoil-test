const opentelemetry = require('@opentelemetry/api');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

const { Kafka } = require('kafkajs');
const db = require('./db.js');

const io = require('socket.io-client');

const socket = io('http://dds:8083');
socket.on('news', (data) => {
  console.log(data);
});

const kfk = new Kafka({
  clientId: 'data-filter-service',
  brokers: ['kafka:9092']
});

const span = opentelemetry.trace.getTracer('default').startSpan('new consumer');
const consumer = kfk.consumer({ groupId: 'test' });
span.end();

function filterMessage(msg) {
  const newMsg = msg.split(' ').filter(token => {
    return token.length < 6;
  }).join(' ');
  return newMsg;
}

function sendToDB(msg) {
  db.addMessage(msg);
}

function pingDDS(msg) {
  socket.emit('msg', {msg: msg});
}

const run = async () => {
  const span = opentelemetry.trace.getTracer('default').startSpan('consumer connect');
  await consumer.connect();
  span.end();
  const span2 = opentelemetry.trace.getTracer('default').startSpan('consumer subscribe');
  await consumer.subscribe({ topic: 'msgs', fromBeginning: true });
  span2.end();
  const span3 = opentelemetry.trace.getTracer('default').startSpan('consumer consuming');
  await consumer.run({
    eachMessage: async ({ message }) => {
      const newMessage = filterMessage(message.value.toString());
      sendToDB(newMessage);
      // Trolling DDS here.
      pingDDS(message.value.toString());
    }
  });
  span3.end();
};

run();
