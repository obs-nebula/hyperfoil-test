const fastify = require('fastify')();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'data-changer-service',
  brokers: ['http://localhost:9092']
});

const producer = kafka.producer();

function changeMessage(msg) {
  // do foobar with the msg here.
  return msg;
}

fastify.post('/', async (request, reply) => {
  console.log(request.body);
  const newMessage = changeMessage(request.body);
  await producer.connect();
  try {
    await producer.send({
      topic: 'msgs',
      messages: [{ value: newMessage }]
    });
  } catch (err) {
    console.log(err);
  }
  reply.send('ok');
});

fastify.listen({ port: 8081 }, (err, _) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});